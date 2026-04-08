const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route POST /api/register
router.post('/register', authController.register);

// Route POST /api/login
router.post('/login', authController.login);

module.exports = router;
