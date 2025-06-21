// controllers/userController.js
const User = require('../models/User');

// Register a new user
const registerUser = async (req, res) => {
  try {
    const {
      name,
      phone,
      whatsapp,
      location,
      phoneLocation,
      lat,
      lng,
      subscribed
    } = req.body;

    // Basic validation
    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({ message: 'User already registered with this phone.' });
    }

    const newUser = new User({
      name,
      phone,
      whatsapp,
      location,
      phoneLocation,
      lat,
      lng,
      subscribed: subscribed !== undefined ? subscribed : true,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Optional: Update user
const updateUser = async (req, res) => {
  try {
    const { phone } = req.params;
    const updateData = req.body;

    const updatedUser = await User.findOneAndUpdate({ phone }, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User updated successfully.', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  registerUser,
  getUsers,
  updateUser,
};
