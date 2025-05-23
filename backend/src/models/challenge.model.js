const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Challenge title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Challenge description is required']
  },
  tag: {
    type: String,
    required: [true, 'Challenge tag is required'],
    trim: true
  },
  points: {
    type: Number,
    required: true,
    min: 0
  },
  initialPoints: {
    type: Number,
    default: function() { return this.points; } // Default to points value if not specified
  },
  bonusPoints: {
    type: Number,
    default: 0 // No bonus by default
  },
  bonusLimit: {
    type: Number,
    default: 0 // No bonus limit by default
  },
  approvedSubmissionsCount: {
    type: Number,
    default: 0 // Start with 0 approved submissions
  },
  resources: [{
    type: String,
    trim: true
  }],
  dependencies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  }],
  status: {
    type: String,
    enum: ['available', 'completed'],
    default: 'available'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isAIChallenge: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  strict: true // This ensures no extra fields are saved
});

module.exports = mongoose.model('Challenge', challengeSchema);
