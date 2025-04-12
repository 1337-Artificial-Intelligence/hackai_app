const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/auth.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Debug middleware
router.use((req, res, next) => {
  console.log('Auth Route:', req.method, req.path);
  console.log('Request Body:', req.body);
  next();
});

router.post('/register', protect, authorize('admin'), register);
router.post('/login', login);
router.get('/profile', protect, getProfile);

module.exports = router;
