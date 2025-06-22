const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: { type: String, unique: true },
  registered: { type: Boolean, default: false },
  campaigns: [String],
});

module.exports = mongoose.model('User', userSchema);
