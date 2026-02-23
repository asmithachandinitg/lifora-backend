const mongoose = require('mongoose');

const sleepStagesSchema = new mongoose.Schema({
  deep:  { type: Number, min: 0, default: 0 },
  light: { type: Number, min: 0, default: 0 },
  rem:   { type: Number, min: 0, default: 0 }
}, { _id: false });

const sleepSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sleepTime: { type: Date, required: true },
  wakeTime:  { type: Date, required: true },
  duration:  { type: Number, required: true }, // minutes
  quality:   { type: Number, min: 1, max: 5, required: true },
  stages:    { type: sleepStagesSchema, default: () => ({ deep: 0, light: 0, rem: 0 }) },
  notes:     { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Sleep', sleepSchema);
