const express = require('express');
const router = express.Router();
const {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  getLeaderboard,
  getCurrentTeam,
  updateJuryScore
} = require('../controllers/team.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/leaderboard', getLeaderboard);
router.get('/me', getCurrentTeam);

router
  .route('/')
  .get(authorize('admin', 'mentor'), getTeams) // Allow mentors to access teams list
  .post(authorize('admin'), createTeam);

router
  .route('/:id')
  .get(authorize('admin'), getTeam)
  .put(authorize('admin'), updateTeam)
  .delete(authorize('admin'), deleteTeam);

// Route for updating jury scores
router.put('/:id/jury-score', authorize('admin'), updateJuryScore);

module.exports = router;
