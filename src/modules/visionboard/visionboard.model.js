// src/modules/visionboard/visionboard.model.js
const mongoose = require('mongoose');

const visionItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['career', 'health', 'finance', 'personal', 'travel', 'relationships', 'learning'],
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  targetDate: {
    type: String,
    default: ''
  },
  achieved: {
    type: Boolean,
    default: false
  },
  achievedDate: {
    type: String,
    default: ''
  },
  affirmation: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('VisionItem', visionItemSchema);
