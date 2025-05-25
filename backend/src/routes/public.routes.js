const express = require('express');
const router = express.Router();
const Team = require('../models/team.model');
const Challenge = require('../models/challenge.model');

// @desc    Get public leaderboard
// @route   GET /api/public/leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const teams = await Team.find({ role: 'team' })
      .select('teamName points juryScore completedChallenges')
      .lean();

    // Get all challenges to calculate progress percentage
    const challenges = await Challenge.find({ isActive: true }).lean();
    
    // Calculate total points from all challenges
    let totalChallengePoints = 0;
    challenges.forEach(challenge => {
      totalChallengePoints += challenge.points || 0;
    });

    // Calculate combined scores and format response
    const leaderboard = teams.map(team => {
      // For progress bar, calculate based on points earned vs total possible points
      const progressPercentage = totalChallengePoints > 0 
        ? Math.round((team.points || 0) / totalChallengePoints * 100) 
        : 0;
      
      // Still keep track of completed challenges count
      const completedCount = team.completedChallenges ? team.completedChallenges.length : 0;
      
      // Calculate normalized challenge score (50% of final score)
      const normalizedChallengeScore = totalChallengePoints > 0
        ? ((team.points || 0) / totalChallengePoints) * 50
        : 0;
        
      // Jury score (50% of final score)
      const juryScore = team.juryScore || 0;
      
      // Calculate final combined score (challenge score + jury score)
      const finalScore = normalizedChallengeScore + juryScore;
      
      return {
        teamName: team.teamName,
        challengePoints: team.points || 0,
        juryScore: juryScore,
        finalScore: parseFloat(finalScore.toFixed(2)),
        progress: progressPercentage,
        completedCount
      };
    });
    
    // Sort by final score in descending order
    leaderboard.sort((a, b) => b.finalScore - a.finalScore);
    
    // Add rank after sorting
    leaderboard.forEach((team, index) => {
      team.rank = index + 1;
    });

    res.json({
      success: true,
      count: leaderboard.length,
      data: leaderboard
    });
  } catch (error) {
    console.error('Error getting public leaderboard:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching leaderboard' 
    });
  }
});

module.exports = router;
