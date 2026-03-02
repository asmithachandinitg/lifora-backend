const mongoose = require('mongoose');

const packingItemSchema = new mongoose.Schema({
  _id:      { type: String },          // ← frontend sends Date.now().toString()
  name:     { type: String, required: true },
  packed:   { type: Boolean, default: false },
  category: { type: String, default: 'essentials' }
}, { _id: false });                    // ← disable auto ObjectId

const itineraryDaySchema = new mongoose.Schema({
  _id:        { type: String },        // ← same fix
  date:       { type: String, required: true },
  title:      { type: String, default: 'Day Plan' },
  activities: { type: [String], default: [] }
}, { _id: false });

const tripExpenseSchema = new mongoose.Schema({
  _id:      { type: String },          // ← same fix
  title:    { type: String, required: true },
  amount:   { type: Number, required: true, min: 0 },
  category: { type: String, default: 'other' },
  date:     { type: String, required: true }
}, { _id: false });

const tripSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true },
  destination: { type: String, required: true },
  startDate:   { type: String, required: true },
  endDate:     { type: String, default: '' },
  status:      { type: String, enum: ['planned', 'ongoing', 'completed'], default: 'planned' },
  budget:      { type: Number, default: 0 },
  expenses:    { type: [tripExpenseSchema], default: [] },
  packingList: { type: [packingItemSchema], default: [] },
  itinerary:   { type: [itineraryDaySchema], default: [] },
  notes:       { type: String, default: '' },
  coverColor:  { type: String, default: '#8B5CF6' }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
