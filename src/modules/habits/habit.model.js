const mongoose = require('mongoose');

const completionSchema = new mongoose.Schema({
  date:      { type: String, required: true },   // 'YYYY-MM-DD'
  completed: { type: Boolean, default: true },
  note:      { type: String, default: '' }
}, { _id: false });

const habitSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:          { type: String, required: true },
  description:   { type: String, default: '' },
  category:      { type: String, enum: ['health','fitness','mindfulness','work','personal','social','finance','learning'], default: 'health' },
  frequency:     { type: String, enum: ['daily','weekly','monthly'], default: 'daily' },
  targetDays:    [{ type: Number }],
  color:         { type: String, default: '#8B5CF6' },
  icon:          { type: String, default: 'star' },
  completions:   [completionSchema],
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  notes:         { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);