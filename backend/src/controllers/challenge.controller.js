const Challenge = require('../models/challenge.model');

// @desc    Create new challenge
// @route   POST /api/challenges
// @access  Admin only
exports.createChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.create(req.body);
    res.status(201).json({
      success: true,
      data: challenge
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all challenges
// @route   GET /api/challenges
// @access  Public
exports.getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ isActive: true });
    
    res.json({
      success: true,
      count: challenges.length,
      data: challenges
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single challenge
// @route   GET /api/challenges/:id
// @access  Public
exports.getChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.json({
      success: true,
      data: challenge
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update challenge
// @route   PUT /api/challenges/:id
// @access  Admin only
exports.updateChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.json({
      success: true,
      data: challenge
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete challenge
// @route   DELETE /api/challenges/:id
// @access  Admin only
exports.deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    // Soft delete
    challenge.isActive = false;
    await challenge.save();

    res.json({
      success: true,
      message: 'Challenge deleted successfully'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
