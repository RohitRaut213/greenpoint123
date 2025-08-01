const express = require('express');
const { signup, login } = require('../controllers/userController');
const router = express.Router();

// Only one signup route
router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
