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
      .populate('challenge', 'title')
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

    await submission.save();

    // If submission is approved, update team progress
    if (status === 'approved') {
      const team = await Team.findById(submission.team);
      const challenge = await Challenge.findById(submission.challenge);

      // Add points
      team.points += challenge.points;

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
    }

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
