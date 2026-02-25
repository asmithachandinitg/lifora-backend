const mongoose = require('mongoose');

const moduleToggleSchema = new mongoose.Schema({
  key:     { type: String },
  enabled: { type: Boolean, default: true }
}, { _id: false });

const userSchema = new mongoose.Schema({
  firstName:    { type: String, required: true, trim: true },
  lastName:     { type: String, default: '' },
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String, required: true },
  phone:        { type: String, default: '' },
  gender:       { type: String, enum: ['male','female','other',''], default: '' },
  dob:          { type: String, default: '' },
  age:          { type: Number, default: 0 },
  country:      { type: String, default: '' },
  state:        { type: String, default: '' },
  city:         { type: String, default: '' },
  weight:       { type: Number, default: 0 },
  height:       { type: Number, default: 0 },
  bmi:          { type: Number, default: 0 },
  profilePhoto: { type: String, default: '' },
  modules:      [moduleToggleSchema],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);