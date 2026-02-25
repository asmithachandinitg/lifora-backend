const mongoose = require('mongoose');

const SYMPTOMS = [
  'cramps','pelvic_pain','back_pain','low_back_pain','shoulder_aches','neck_aches',
  'migraines','headache','muscle_pain','bloating','nausea','diarrhea','constipation',
  'hunger','cravings','fatigue','swelling','weight_gain','breast_tenderness',
  'breast_sensitivity','hot_flashes','night_sweats','chills','fever','itchiness',
  'rashes','dizziness','ovulation_pain','acne','mood_swings','irritation','anxiety',
  'stress','tension','confusion','insomnia','moodiness','pms','illness'
];

// ── Period entry ──────────────────────────────────────────────
const periodSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate:    { type: String, required: true },
  endDate:      { type: String, default: null },
  flow:         { type: String, enum: ['spotting','light','medium','heavy'], required: true },
  painLevel:    { type: Number, min: 1, max: 5, required: true },
  mood:         { type: Number, min: 1, max: 5, required: true },
  symptoms:     [{ type: String, enum: SYMPTOMS }],
  notes:        { type: String, default: null },
  cycleLength:  { type: Number, default: null },
  periodLength: { type: Number, default: null }
}, { timestamps: true });

// ── Daily symptom log ─────────────────────────────────────────
const dailySymptomSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:      { type: String, required: true },
  mood:      { type: Number, min: 1, max: 5, required: true },
  painLevel: { type: Number, min: 1, max: 5, required: true },
  symptoms:  [{ type: String, enum: SYMPTOMS }],
  notes:     { type: String, default: null }
}, { timestamps: true });

// Ensure one daily log per user per date
dailySymptomSchema.index({ userId: 1, date: 1 }, { unique: true });

const Period       = mongoose.model('Period',       periodSchema);
const DailySymptom = mongoose.model('DailySymptom', dailySymptomSchema);

module.exports = { Period, DailySymptom, SYMPTOMS };
