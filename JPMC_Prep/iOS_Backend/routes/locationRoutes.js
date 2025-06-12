const express = require("express");
const router = express.Router();
const {
  createLocation,
  getAllLocations,
  bulkUploadLocations
} = require("../controllers/locationController");

// Public (or you can add middleware here to restrict)
router.post("/", createLocation);
router.get("/", getAllLocations);
router.post("/bulk", bulkUploadLocations);

module.exports = router;