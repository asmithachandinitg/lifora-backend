// src/modules/knowledge/knowledge.model.js
const mongoose = require('mongoose');

const knowledgeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['technology', 'science', 'health', 'finance', 'productivity', 'philosophy', 'history', 'other'],
    default: 'other'
  },
  sourceType: {
    type: String,
    enum: ['book', 'course', 'article', 'video', 'podcast', 'other'],
    default: 'other'
  },
  source: {
    type: String,
    trim: true,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  keyTakeaways: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  date: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  }
}, { timestamps: true });

module.exports = mongoose.model('Knowledge', knowledgeSchema);
