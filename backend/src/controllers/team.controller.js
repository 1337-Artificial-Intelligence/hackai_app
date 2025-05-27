const Team = require('../models/team.model');
const Submission = require('../models/submission.model');
const bcrypt = require('bcryptjs');

// @desc    Get all teams
// @route   GET /api/teams
// @access  Admin only
exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find({ isActive: true })
      .select('-password')
      .populate('currentChallenge', 'title')
      .sort('-points');

    res.json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get single team
// @route   GET /api/teams/:id
// @access  Admin only
exports.getTeam = async (req, res) => {
  try {
    const team = await Team.findOne({ _id: req.params.id, isActive: true })
      .populate('currentChallenge')
      .populate('completedChallenges');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const teamData = team.toObject();
    // For non-admin users, exclude password
    if (req.user.role !== 'admin') {
      delete teamData.password;
    }

    res.json({
      success: true,
      data: teamData
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create team
// @route   POST /api/teams
// @access  Admin only
exports.createTeam = async (req, res) => {
  try {
    const { teamName, members, password, role } = req.body;

    // Validate required fields
    if (!teamName || !password) {
      return res.status(400).json({ message: 'Team name and password are required' });
    }

    // Check if team already exists
    const existingTeam = await Team.findOne({ teamName });
    if (existingTeam) {
      return res.status(400).json({ message: 'Team name already exists' });
    }

    const team = await Team.create({
      teamName,
      members: members || [],
      password,
      role: role || 'team' // Use provided role or default to 'team'
    });

    // Don't send password back
    team.password = undefined;

    res.status(201).json({
      success: true,
      data: team
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Admin only
exports.updateTeam = async (req, res) => {
  try {
    const { teamName, members, password } = req.body;
    const updateData = { teamName, members };

    // Only update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const team = await Team.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.json({
      success: true,
      data: team
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Admin only
exports.deleteTeam = async (req, res) => {
  try {
    // First, find the team to confirm it exists
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Delete all submissions associated with this team
    await Submission.deleteMany({ team: req.params.id });
    console.log(`Deleted all submissions for team ${team.teamName}`);
    
    // Now delete the team
    await Team.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Team and all associated submissions deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get leaderboard
// @route   GET /api/teams/leaderboard
// @access  Private
exports.getLeaderboard = async (req, res) => {
  try {
    const teams = await Team.find({ 
      isActive: true, 
      role: { $nin: ['admin', 'mentor'] } // Exclude both admin and mentor roles
    })
      .select('teamName points role members')
      .sort('-points');

    res.json({
      success: true,
      data: teams
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update jury score for a team
// @route   PUT /api/teams/:id/jury-score
// @access  Admin only
exports.updateJuryScore = async (req, res) => {
  try {
    const { juryScore } = req.body;
    
    // Validate the jury score (should be a non-negative number)
    if (juryScore === undefined || juryScore < 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Jury score must be a non-negative number' 
      });
    }
    
    // No need to normalize the score here, as it will be normalized relative to other scores in the leaderboard calculation
    
    const team = await Team.findOneAndUpdate(
      { _id: req.params.id, isActive: true },
      { juryScore },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!team) {
      return res.status(404).json({ 
        success: false,
        message: 'Team not found' 
      });
    }
    
    // Notify clients about the leaderboard update
    const io = req.app.get('io');
    if (io) {
      io.to('leaderboard-room').emit('leaderboard-update');
    }
    
    res.json({
      success: true,
      data: team
    });
  } catch (error) {
    console.error('Error updating jury score:', error);
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get current team data
// @route   GET /api/teams/me
// @access  Private
exports.getCurrentTeam = async (req, res) => {
  try {
    const team = await Team.findOne({ _id: req.user.id, isActive: true })
      .select('-password')
      .populate('members', 'name role')
      .populate('currentChallenge', 'title')
      .populate('completedChallenges', 'title');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Get team rank
    const allTeams = await Team.find({ isActive: true })
      .sort('-points');
    
    const rank = allTeams.findIndex(t => t._id.toString() === team._id.toString()) + 1;

    const teamData = team.toObject();
    teamData.rank = rank;

    res.json({
      success: true,
      data: teamData
    });
  } catch (error) {
    console.error('Error in getCurrentTeam:', error);
    res.status(400).json({ message: error.message });
  }
};
