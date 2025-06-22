const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
});

module.exports = mongoose.model('Campaign', campaignSchema);
