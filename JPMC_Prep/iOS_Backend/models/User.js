// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  whatsapp: {
    type: String, 
    required: false,
  },
  location: {
    type: String, 
    required: false,
  },
  phoneLocation: {
    type: String, 
    required: false,
  },
  lat: {
    type: Number, 
    required: false,
  },
  lng: {
    type: Number, 
    required: false,
  },
  subscribed: {
    type: Boolean,
    default: true, 
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
