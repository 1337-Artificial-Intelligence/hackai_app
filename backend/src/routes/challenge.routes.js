const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getAllChallenges,
  getChallenge,
  createChallenge,
  updateChallenge,
  deleteChallenge
} = require('../controllers/challenge.controller');

// Public routes
router.get('/', getAllChallenges);
router.get('/:id', getChallenge);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), createChallenge);
router.put('/:id', protect, authorize('admin'), updateChallenge);
router.delete('/:id', protect, authorize('admin'), deleteChallenge);

module.exports = router;
