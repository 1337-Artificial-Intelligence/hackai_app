const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  githubLink: {
    type: String,
    required: [true, 'GitHub link is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Submission description is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'bypassed'],
    default: 'pending'
  },
  feedback: {
    type: String
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  reviewedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index to ensure one active submission per team per challenge
submissionSchema.index({ team: 1, challenge: 1, status: 1 });

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;
