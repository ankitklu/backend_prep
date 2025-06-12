const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  name: String,
  address: String,
  lat: Number,
  lng: Number,
  role: {
    type: String,
    enum: ["admin", "volunteer"],
    required: true
  }
});

module.exports = mongoose.model("Location", LocationSchema);
