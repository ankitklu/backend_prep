const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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


const Location = mongoose.model("Location", LocationSchema);

app.post("/api/locations", async (req, res) => {
  try {
    const { name, address, role, lat, lng } = req.body;

    let finalLat = lat;
    let finalLng = lng;

    // If lat/lng not provided, use Geocoding API
    if (finalLat == null || finalLng == null) {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;

      const geoRes = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address,
            key: apiKey
          }
        }
      );

      const results = geoRes.data.results;

      if (!results || results.length === 0) {
        return res.status(400).json({ error: "Invalid address. Could not geocode." });
      }

      finalLat = results[0].geometry.location.lat;
      finalLng = results[0].geometry.location.lng;
    }

    const newLocation = new Location({
      name,
      address,
      lat: finalLat,
      lng: finalLng,
      role
    });

    await newLocation.save();
    res.json(newLocation);
  } catch (error) {
    console.error("Error in POST /api/locations:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/locations", async (req, res) => {
  const locations = await Location.find();
  res.json(locations);
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
