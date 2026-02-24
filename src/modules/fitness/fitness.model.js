const mongoose = require('mongoose');

const exerciseSetSchema = new mongoose.Schema({
  reps:   { type: Number, required: true, min: 0 },
  weight: { type: Number, min: 0 }
}, { _id: false });

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: [exerciseSetSchema], default: [] }
}, { _id: false });

const workoutSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:          { type: String, required: true },
  category:       { type: String, enum: ['cardio', 'strength', 'flexibility', 'sports'], required: true },
  duration:       { type: Number, required: true, min: 1 },
  caloriesBurned: { type: Number, default: 0, min: 0 },
  stepsCalories:  { type: Number, default: 0, min: 0 },
  workoutTime:    { type: String, default: '08:00' },
  exercises:      { type: [exerciseSchema], default: [] },
  notes:          { type: String, default: '' },
  date:           { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
