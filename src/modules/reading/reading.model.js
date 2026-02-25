const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  title:      { type: String, required: true, trim: true },
  author:     { type: String, default: '' },
  status:     { type: String, enum: ['want', 'reading', 'completed', 'dnf'], default: 'want' },
  genre:      { type: String, default: '' },
  tags:       [{ type: String }],
  pagesTotal: { type: Number, default: 0 },
  pagesRead:  { type: Number, default: 0 },
  startDate:  { type: String, default: '' },
  endDate:    { type: String, default: '' },
  coverUrl:   { type: String, default: '' },
  rating:     { type: Number, min: 0, max: 5, default: 0 },
  review:     { type: String, default: '' },
  notes:      { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Reading', readingSchema);