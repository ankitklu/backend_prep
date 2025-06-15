const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

// GET ALL ADMINS
router.get("/all", async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admins" });
  }
});

// ADD NEW ADMIN
router.post("/add", async (req, res) => {
  try {
    const { email, password, address, lat, lng, phone } = req.body;
    const admin = new Admin({ email, password, address, lat, lng, phone });
    await admin.save();
    res.status(201).json(admin);
  } catch (err) {
    res.status(500).json({ error: "Failed to add admin" });
  }
});

// UPDATE ADMIN
router.put("/update/:id", async (req, res) => {
  try {
    const { email, address, lat, lng, phone } = req.body;
    const updated = await Admin.findByIdAndUpdate(
      req.params.id,
      { email, address, lat, lng, phone },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Admin not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update admin" });
  }
});

// DELETE ADMIN
router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await Admin.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Admin not found" });
    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete admin" });
  }
});

module.exports = router;
