const Team = require('../models/team.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// @desc    Register team
// @route   POST /api/auth/register
// @access  Admin only
exports.register = async (req, res) => {
  try {
    const { teamName, member1, member2, member3, password } = req.body;

    // Check if team already exists
    const teamExists = await Team.findOne({ teamName });
    if (teamExists) {
      return res.status(400).json({ message: 'Team already exists' });
    }

    // Create team
    const team = await Team.create({
      teamName,
      member1,
      member2,
      member3,
      password
    });

    // Generate token
    const token = generateToken(team._id);

    res.status(201).json({
      success: true,
      token,
      data: {
        id: team._id,
        teamName: team.teamName,
        member1: team.member1,
        member2: team.member2,
        member3: team.member3,
        role: team.role
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Login team
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { teamName, password } = req.body;
    console.log('Login attempt:', { teamName, password });

    // Check if team exists
    const team = await Team.findOne({ teamName });
    console.log('Found team:', team ? { 
      teamName: team.teamName, 
      hashedPassword: team.password,
      role: team.role 
    } : 'not found');

    if (!team) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, team.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if team is active
    if (!team.isActive) {
      return res.status(401).json({ message: 'Team is deactivated' });
    }

    // Generate token
    const token = generateToken(team._id);

    res.json({
      success: true,
      token,
      data: {
        id: team._id,
        teamName: team.teamName,
        member1: team.member1,
        member2: team.member2,
        member3: team.member3,
        role: team.role,
        points: team.points
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get current team profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const team = await Team.findById(req.team.id)
      .select('-password')
      .populate('currentChallenge')
      .populate('completedChallenges');

    res.json({
      success: true,
      data: team
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
