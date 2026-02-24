const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  time: { type: String, required: true } // "08:00"
}, { _id: false });

const medicineSchema = new mongoose.Schema({
  userId:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:              { type: String, required: true },
  dosage:            { type: String, required: true },
  frequency:         { type: String, enum: ['daily', 'weekly', 'as-needed'], required: true },
  reminders:         { type: [reminderSchema], default: [] },
  stock:             { type: Number, default: 0, min: 0 },
  lowStockThreshold: { type: Number, default: 5, min: 0 },
  notes:             { type: String, default: '' },
  startDate:         { type: Date, required: true },
  endDate:           { type: Date },
  status:            { type: String, enum: ['active', 'paused', 'completed'], default: 'active' }
}, { timestamps: true });

const doseLogSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicineId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  medicineName: { type: String, required: true },
  dosage:       { type: String, required: true },
  takenAt:      { type: Date, default: Date.now },
  notes:        { type: String, default: '' }
}, { timestamps: true });

module.exports = {
  Medicine: mongoose.model('Medicine', medicineSchema),
  DoseLog:  mongoose.model('DoseLog', doseLogSchema)
};
