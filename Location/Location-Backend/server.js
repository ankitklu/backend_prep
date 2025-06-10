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

app.post("/api/locations/bulk", async (req, res) => {
  try {
    const locationsData = req.body;

    if (!Array.isArray(locationsData)) {
      return res.status(400).json({ error: "Invalid data format. Expected an array." });
    }

    const processedLocations = [];

    for (const item of locationsData) {
      const { name, address, role, lat, lng } = item;

      // Basic validation
      if (!name || !address || !role) continue;

      let finalLat = lat;
      let finalLng = lng;

      // Use Geocoding if lat/lng not provided
      if (!finalLat || !finalLng) {
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
        if (!results || results.length === 0) continue;

        finalLat = results[0].geometry.location.lat;
        finalLng = results[0].geometry.location.lng;
      }

      processedLocations.push({
        name,
        address,
        role,
        lat: finalLat,
        lng: finalLng
      });
    }

    if (processedLocations.length === 0) {
      return res.status(400).json({ error: "No valid locations found to insert." });
    }

    const inserted = await Location.insertMany(processedLocations);
    res.json({ success: true, insertedCount: inserted.length });
  } catch (err) {
    console.error("Error in /api/locations/bulk:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
