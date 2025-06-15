const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: false },   // Optional, can make required if needed
  lat: { type: Number, required: false },       // Optional latitude
  lng: { type: Number, required: false },       // Optional longitude
  phone: { type: String, required: false },     // Optional phone number
});

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('Admin', adminSchema);
