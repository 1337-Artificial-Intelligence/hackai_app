const Submission = require('../models/submission.model');
const Team = require('../models/team.model');
const Challenge = require('../models/challenge.model');
const jwt = require('jsonwebtoken');

// @desc    Submit a challenge
// @route   POST /api/submissions
// @access  Private
exports.createSubmission = async (req, res) => {
  try {
    const { challengeId, githubLink, description } = req.body;

    // Get team from token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const team = await Team.findById(decoded.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if challenge exists
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Check if team has already submitted this challenge
    const existingSubmission = await Submission.findOne({
      team: team._id,
      challenge: challengeId,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingSubmission) {
      return res.status(400).json({ 
        message: 'You have already submitted this challenge' 
      });
    }

    // Create submission
    const submission = await Submission.create({
      team: team._id,
      challenge: challengeId,
      githubLink,
      description
    });

    res.status(201).json({
      success: true,
      data: submission
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all submissions
// @route   GET /api/submissions
// @access  Admin only
exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate('team', 'teamName')
      .populate('challenge', 'title description tag isAIChallenge points')
      .sort('-createdAt');

    res.json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get team submissions
// @route   GET /api/submissions/team
// @access  Private
exports.getTeamSubmissions = async (req, res) => {
  try {
    console.log('Getting team submissions for team:', req.user?.id);
    
    const submissions = await Submission.find({ team: req.user.id })
      .populate({
        path: 'challenge',
        select: 'title description tag dependencies'
      })
      .sort('-createdAt');

    console.log('Found submissions:', submissions);

    res.json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    console.error('Error in getTeamSubmissions:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Validate submission
// @route   PUT /api/submissions/:id/validate
// @access  Admin only
exports.validateSubmission = async (req, res) => {
  try {
    // Get admin from token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const reviewer = await Team.findById(decoded.id);
    if (!reviewer || (reviewer.role !== 'admin' && reviewer.role !== 'mentor')) {
      return res.status(403).json({ message: 'Not authorized to validate submissions' });
    }

    const { status, feedback } = req.body;
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (submission.status !== 'pending') {
      return res.status(400).json({ 
        message: 'This submission has already been reviewed' 
      });
    }

    submission.status = status;
    submission.feedback = feedback;
    submission.reviewedBy = reviewer._id;
    submission.reviewedAt = Date.now();
    
    // If this is an AI challenge and score was provided, save the score
    if (req.body.score !== undefined) {
      submission.score = req.body.score;
    }

    await submission.save();

    // If submission is approved, update team progress
    if (status === 'approved') {
      const team = await Team.findById(submission.team);
      const challenge = await Challenge.findById(submission.challenge);

      // Check if this is an AI challenge
      if (challenge.isAIChallenge) {
        // For AI challenges, we need to recalculate points for all teams
        await recalculateAIChallengePoints(challenge._id);
      } else {
        // For regular challenges, apply dynamic point system
        // Increment the approved submissions counter for this challenge
        challenge.approvedSubmissionsCount = (challenge.approvedSubmissionsCount || 0) + 1;
        await challenge.save();
        
        // Calculate points to award based on bonus system
        let pointsAwarded = challenge.initialPoints || challenge.points;
        
        // If this is within the bonus limit, add bonus points
        if (challenge.bonusLimit > 0 && challenge.approvedSubmissionsCount <= challenge.bonusLimit) {
          pointsAwarded += challenge.bonusPoints || 0;
          console.log(`Awarding bonus points to team ${team.teamName} for early submission (${challenge.approvedSubmissionsCount}/${challenge.bonusLimit})`);
        }
        
        // Save the points awarded to this submission
        submission.pointsAwarded = pointsAwarded;
        await submission.save();
        
        // Add points to team
        team.points += pointsAwarded;
      }

      // Add to completed challenges
      team.completedChallenges.push(challenge._id);

      // Find available challenges that have this challenge as their only dependency
      const nextChallenges = await Challenge.find({
        dependencies: { $size: 1, $eq: [challenge._id] },
        isActive: true
      });

      // If there's a next challenge that depends only on this one, set it as current
      if (nextChallenges.length > 0) {
        team.currentChallenge = nextChallenges[0]._id;
      }

      await team.save();
      
      // Emit leaderboard update via WebSocket
      const io = req.app.get('io');
      if (io) {
        io.to('leaderboard-room').emit('leaderboard-update');
        console.log('Emitted leaderboard-update event');
      }
    }
    
    // Send response
    res.json({
      success: true,
      data: submission
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get submissions for a specific challenge
// @route   GET /api/submissions/challenge/:id
// @access  Public
exports.getChallengeSubmissions = async (req, res) => {
  try {
    const challengeId = req.params.id;
    
    // Get the challenge to check if it's an AI challenge
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    // Get approved submissions for this challenge
    const submissions = await Submission.find({
      challenge: challengeId,
      status: 'approved'
    })
    .populate('team', 'teamName') // Only get team name, not all team data
    .sort({ score: -1 }) // Sort by score descending
    .lean(); // Convert to plain JS object for better performance

    // If it's an AI challenge, include scores in the response
    if (challenge.isAIChallenge) {
      const leaderboardData = submissions.map((sub, index) => ({
        rank: index + 1,
        teamName: sub.team?.teamName || 'Unknown Team',
        score: sub.score || 0,
        aiPoints: sub.aiPoints || 0
      }));
      
      return res.json({
        success: true,
        isAIChallenge: true,
        count: leaderboardData.length,
        data: leaderboardData
      });
    }
    
    // For regular challenges, just return the count of approved submissions
    return res.json({
      success: true,
      isAIChallenge: false,
      count: submissions.length,
      data: submissions.map(sub => ({
        teamName: sub.team?.teamName || 'Unknown Team'
      }))
    });
  } catch (error) {
    console.error('Error getting challenge submissions:', error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * Recalculate points for all teams that completed an AI Challenge
 * Points are awarded based on ranking (100 points for highest score, scaled down to 0)
 */
async function recalculateAIChallengePoints(challengeId) {
  try {
    // Get all approved submissions for this challenge
    const submissions = await Submission.find({
      challenge: challengeId,
      status: 'approved',
      score: { $exists: true, $ne: null } // Only include submissions with scores
    }).sort({ score: -1 }); // Sort by score descending

    if (submissions.length === 0) return;

    // Calculate points based on ranking
    const highestScore = submissions[0].score;
    const lowestScore = submissions.length > 1 ? 
      submissions[submissions.length - 1].score : 
      highestScore;

    // Calculate and update AI points for each submission
    for (let i = 0; i < submissions.length; i++) {
      const submission = submissions[i];
      
      // If all scores are the same, everyone gets 100 points
      let aiPoints = 100;
      
      // Otherwise, scale points from 100 (highest) to 0 (lowest) based on score ranking
      if (highestScore !== lowestScore) {
        // Normalize the score between 0 and 1
        const normalizedScore = (submission.score - lowestScore) / (highestScore - lowestScore);
        // Scale to 0-100 range
        aiPoints = Math.round(normalizedScore * 100);
      }
      
      // Update submission with calculated AI points
      submission.aiPoints = aiPoints;
      await submission.save();
      
      // Update team points by recalculating all challenge points
      await updateTeamPoints(submission.team);
    }
  } catch (error) {
    console.error('Error recalculating AI challenge points:', error);
  }
}

/**
 * Update a team's total points by summing all their approved challenge points
 */
async function updateTeamPoints(teamId) {
  try {
    const team = await Team.findById(teamId);
    if (!team) return;
    
    // Get all approved submissions for this team
    const regularSubmissions = await Submission.find({
      team: teamId,
      status: 'approved'
    }).populate('challenge');
    
    // Calculate total points
    let totalPoints = 0;
    
    // Process each submission separately
    for (const sub of regularSubmissions) {
      // For regular challenges
      if (!sub.challenge.isAIChallenge) {
        // Use pointsAwarded if available, otherwise fall back to challenge.points
        if (sub.pointsAwarded) {
          totalPoints += sub.pointsAwarded;
          console.log(`Adding awarded points: ${sub.pointsAwarded} for team ${team.teamName}, total now: ${totalPoints}`);
        } else {
          totalPoints += sub.challenge.points || 0;
          console.log(`Adding regular points: ${sub.challenge.points} for team ${team.teamName}, total now: ${totalPoints}`);
        }
      }
      // For AI challenges
      else if (sub.score !== undefined && sub.aiPoints !== undefined) {
        totalPoints += sub.aiPoints || 0;
        console.log(`Adding AI points: ${sub.aiPoints} for team ${team.teamName}, total now: ${totalPoints}`);
      }
    }
    
    // Update team points
    console.log(`Final points for team ${team.teamName}: ${totalPoints}`);
    team.points = totalPoints;
    await team.save();
  } catch (error) {
    console.error('Error updating team points:', error);
  }
}
