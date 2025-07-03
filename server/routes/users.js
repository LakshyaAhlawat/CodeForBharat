const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// Get current user
router.get('/me', auth, userController.getProfile);

// Get user profile
router.get('/profile/:id?', auth, userController.getProfile);

// Update profile
router.put('/profile', auth, userController.updateProfile);

// Get user dashboard
router.get('/dashboard', auth, userController.getDashboard);

// Get user's games
router.get('/:id?/games', auth, userController.getUserGames);

module.exports = router;