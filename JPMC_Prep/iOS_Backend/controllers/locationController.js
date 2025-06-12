const Location = require("../models/Location");
const axios = require("axios");

exports.createLocation = async (req, res) => {
  try {
    const { name, address, role, lat, lng } = req.body;
    let finalLat = lat, finalLng = lng;

    if (finalLat == null || finalLng == null) {
      const geoRes = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: { address, key: process.env.GOOGLE_MAPS_API_KEY }
      });

      const results = geoRes.data.results;
      if (!results.length) return res.status(400).json({ error: "Invalid address" });

      finalLat = results[0].geometry.location.lat;
      finalLng = results[0].geometry.location.lng;
    }

    const newLocation = new Location({ name, address, role, lat: finalLat, lng: finalLng });
    await newLocation.save();
    res.json(newLocation);
  } catch (err) {
    console.error("POST /api/locations:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllLocations = async (req, res) => {
  const locations = await Location.find();
  res.json(locations);
};

exports.bulkUploadLocations = async (req, res) => {
  try {
    const locationsData = req.body;
    if (!Array.isArray(locationsData)) return res.status(400).json({ error: "Expected array" });

    const processed = [];

    for (const { name, address, role, lat, lng } of locationsData) {
      if (!name || !address || !role) continue;
      let finalLat = lat, finalLng = lng;

      if (!finalLat || !finalLng) {
        const geoRes = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
          params: { address, key: process.env.GOOGLE_MAPS_API_KEY }
        });

        const results = geoRes.data.results;
        if (!results.length) continue;
        finalLat = results[0].geometry.location.lat;
        finalLng = results[0].geometry.location.lng;
      }

      processed.push({ name, address, role, lat: finalLat, lng: finalLng });
    }

    if (!processed.length) return res.status(400).json({ error: "No valid locations" });

    const inserted = await Location.insertMany(processed);
    res.json({ success: true, insertedCount: inserted.length });
  } catch (err) {
    console.error("BULK /api/locations:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
