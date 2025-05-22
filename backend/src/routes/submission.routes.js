const express = require('express');
const router = express.Router();
const {
  createSubmission,
  getSubmissions,
  getTeamSubmissions,
  validateSubmission
} = require('../controllers/submission.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router
  .route('/')
  .post(createSubmission)
  .get(authorize('admin', 'mentor'), getSubmissions);

router.get('/team', getTeamSubmissions);

router.put('/:id/validate', authorize('admin', 'mentor'), validateSubmission);

// DELETE route to cancel a pending submission
router.delete('/:id', async (req, res) => {
  try {
    const submission = await require('../models/submission.model').findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    // Check if user is the team that created the submission
    // Convert both to strings for proper comparison
    if (submission.team.toString() !== req.user.id.toString()) {
      console.log('Auth mismatch:', {userID: req.user.id.toString(), submissionTeam: submission.team.toString()});
      return res.status(403).json({ message: 'Not authorized to delete this submission' });
    }
    
    // Only allow deleting pending submissions
    if (submission.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending submissions can be canceled' });
    }
    
    await submission.deleteOne();
    
    res.json({
      success: true,
      message: 'Submission successfully canceled',
      data: {}
    });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
