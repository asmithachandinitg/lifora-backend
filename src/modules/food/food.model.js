const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  quantity: { type: String, default: null },   // optional free text e.g. "1 cup"
  calories: { type: Number, default: null },   // all nutrition optional
  protein:  { type: Number, default: null },
  carbs:    { type: Number, default: null },
  fat:      { type: Number, default: null }
}, { _id: false });

const foodSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:     { type: String, required: true },   // YYYY-MM-DD
  mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
  time:     { type: String, required: true },   // HH:MM
  items:    { type: [foodItemSchema], required: true },
  notes:    { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);
