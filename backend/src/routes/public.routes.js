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

    // Find max and min values for normalization
    const allChallengePoints = teams.map(team => team.points || 0);
    const allJuryScores = teams.map(team => team.juryScore || 0);
    
    const maxChallengePoints = Math.max(...allChallengePoints, 1); // Avoid division by zero
    const minChallengePoints = Math.min(...allChallengePoints);
    const maxJuryScore = Math.max(...allJuryScores, 1); // Avoid division by zero
    const minJuryScore = Math.min(...allJuryScores);
    
    // Calculate the normalization denominators (avoid division by zero)
    const challengeDenominator = maxChallengePoints - minChallengePoints || 1;
    const juryDenominator = maxJuryScore - minJuryScore || 1;
    
    // Calculate combined scores and format response
    const leaderboard = teams.map(team => {
      // For progress bar, calculate based on points earned vs total possible points
      const progressPercentage = totalChallengePoints > 0 
        ? Math.round((team.points || 0) / totalChallengePoints * 100) 
        : 0;
      
      // Still keep track of completed challenges count
      const completedCount = team.completedChallenges ? team.completedChallenges.length : 0;
      
      // Apply new normalization formula: (value - min) / (max - min)
      const normalizedChallengeScore = 
        (team.points || 0) === minChallengePoints && maxChallengePoints === minChallengePoints
          ? 0.5 // Edge case: all teams have same score
          : ((team.points || 0) - minChallengePoints) / challengeDenominator;
      
      const normalizedJuryScore = 
        (team.juryScore || 0) === minJuryScore && maxJuryScore === minJuryScore
          ? 0.5 // Edge case: all teams have same score
          : ((team.juryScore || 0) - minJuryScore) / juryDenominator;
      
      // Calculate final combined score (normalized challenge score + normalized jury score) * 100
      const finalScore = (normalizedChallengeScore + normalizedJuryScore) * 100; // Multiply by 100 as specified
      
      return {
        teamName: team.teamName,
        challengePoints: team.points || 0,
        juryScore: team.juryScore || 0,
        normalizedChallengeScore: parseFloat(normalizedChallengeScore.toFixed(2)),
        normalizedJuryScore: parseFloat(normalizedJuryScore.toFixed(2)),
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
