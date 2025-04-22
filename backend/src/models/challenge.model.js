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
  }
}, {
  timestamps: true,
  strict: true // This ensures no extra fields are saved
});

module.exports = mongoose.model('Challenge', challengeSchema);
