const mongoose = require('mongoose');

const bloodPressureSchema = new mongoose.Schema({
  systolic:  { type: Number, min: 60,  max: 200 },
  diastolic: { type: Number, min: 40,  max: 130 }
}, { _id: false });

const pregnancyProfileSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  dueDate: { type: String, required: true },
  lmpDate: { type: String, default: null }
}, { timestamps: true });

const pregnancyEntrySchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:           { type: String, required: true },
  week:           { type: Number, min: 1, max: 42, required: true },
  weight:         { type: Number, default: null },
  bloodPressure:  { type: bloodPressureSchema, default: null },
  babyMovements:  { type: Number, default: null },
  symptoms:       [{ type: String, enum: [
    'nausea', 'fatigue', 'back_pain', 'heartburn', 'swelling',
    'headache', 'cramps', 'spotting', 'mood_swings', 'insomnia', 'cravings'
  ]}],
  mood:           { type: Number, min: 1, max: 5, default: 3 },
  notes:          { type: String, default: '' }
}, { timestamps: true });

const PregnancyProfile = mongoose.model('PregnancyProfile', pregnancyProfileSchema);
const PregnancyEntry   = mongoose.model('PregnancyEntry',   pregnancyEntrySchema);

module.exports = { PregnancyProfile, PregnancyEntry };
