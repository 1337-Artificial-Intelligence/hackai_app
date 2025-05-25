const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: [true, 'Team name is required'],
    unique: true,
    trim: true
  },
  members: [{
    type: String,
    trim: true
  }],
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  role: {
    type: String,
    enum: ['team', 'admin', 'mentor'],
    default: 'team'
  },
  currentChallenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  },
  completedChallenges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  }],
  points: {
    type: Number,
    default: 0
  },
  juryScore: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
teamSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
teamSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Delete existing model if it exists
delete mongoose.models.Team;

// Create new model
const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
