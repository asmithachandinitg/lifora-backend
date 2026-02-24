const mongoose = require('mongoose');

const packingItemSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  packed:   { type: Boolean, default: false },
  category: { type: String, default: 'essentials' }
});

const itineraryDaySchema = new mongoose.Schema({
  date:       { type: String, required: true },
  title:      { type: String, default: 'Day Plan' },
  activities: { type: [String], default: [] }
});

const tripExpenseSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  amount:   { type: Number, required: true, min: 0 },
  category: { type: String, default: 'other' },
  date:     { type: String, required: true }
});

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
