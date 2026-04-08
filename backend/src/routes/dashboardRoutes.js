const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

// Endpoint Dashboard ini dilindungi oleh token JWT
router.get('/dashboard', authMiddleware, dashboardController.getDashboardData);

module.exports = router;
