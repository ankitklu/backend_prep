const express = require('express');
const { registerUser, getUsers, updateUser } = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.get('/', getUsers);
router.put('/:phone', updateUser); // Update user by phone number

module.exports = router;
