const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { type: String, enum: ['great', 'good', 'okay', 'sad', 'angry'], required: true },
  scale: { type: Number, min: 1, max: 10, required: true },
  note: { type: String, default: '' },
  datetime: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Mood', moodSchema);
