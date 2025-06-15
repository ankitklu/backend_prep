const express = require('express');
const { loginAdmin } = require('../controllers/authController');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const { addAdmin, getAllAdmins } = require('../controllers/adminController');

router.post('/login', loginAdmin);

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashed = password;

  const admin = new Admin({ email, password: hashed });
  await admin.save();

  res.json({ message: 'Admin registered' });
});

router.post('/add', addAdmin);
router.get('/all', getAllAdmins);



module.exports = router;
