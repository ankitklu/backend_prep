const Admin = require('../models/Admin');

// Create new admin
const addAdmin = async (req, res) => {
  try {
    const { email, password, address, lat, lng, phone } = req.body;

    // Optional: Check for duplicate
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Admin already exists' });

    const newAdmin = new Admin({ email, password, address, lat, lng, phone });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatedAdmin= async (req, res) => {
  try {
    const { email, address, lat, lng, phone } = req.body;
    const updateFields = { email, address, lat, lng, phone };

    // Remove undefined/null fields
    Object.keys(updateFields).forEach(key => {
      if (updateFields[key] === undefined || updateFields[key] === "") {
        delete updateFields[key];
      }
    });

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json(updatedAdmin);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};

module.exports = {
  addAdmin,
  getAllAdmins,
  updatedAdmin
};
