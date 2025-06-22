const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: String,
  hasParticipated: Boolean,
});

module.exports = mongoose.model('User', userSchema);
