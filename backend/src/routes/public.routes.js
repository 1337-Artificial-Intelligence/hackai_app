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
      .select('teamName points completedChallenges')
      .sort('-points')
      .lean();

    // Get all challenges to calculate progress percentage
    const challenges = await Challenge.find({ isActive: true }).lean();
    const totalChallenges = challenges.length;

    // Calculate percentage and format response
    const leaderboard = teams.map((team, index) => {
      const completedCount = team.completedChallenges ? team.completedChallenges.length : 0;
      const progressPercentage = totalChallenges > 0 
        ? Math.round((completedCount / totalChallenges) * 100) 
        : 0;
      
      return {
        rank: index + 1,
        teamName: team.teamName,
        points: team.points,
        progress: progressPercentage,
        completedCount
      };
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
