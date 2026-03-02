const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    trim: true
  },

  content: {
    type: String,
    required: true
  },

  mood: {
    type: String,
    enum: ['happy', 'sad', 'angry', 'neutral', 'excited'],
    default: 'neutral'
  },

  entryDate: {
    type: Date,
    default: Date.now
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // ── Travel link ──────────────────────────────
  linkedTripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    default: null
  },

  linkedTripName: {
    type: String,
    default: null
  }
  // ─────────────────────────────────────────────

}, { timestamps: true });

module.exports = mongoose.model('Diary', diarySchema);
