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
  .get(authorize('admin'), getSubmissions);

router.get('/team', getTeamSubmissions);

router.put('/:id/validate', authorize('admin'), validateSubmission);

module.exports = router;
