const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { auth } = require('../middleware/auth');
const { validateReview, validateObjectId } = require('../middleware/validation');

// Add review to game (protected)
router.post('/games/:gameId', auth, validateObjectId, validateReview, reviewController.addReview);

// Get reviews for game
router.get('/games/:gameId', validateObjectId, reviewController.getGameReviews);

// Update review (protected)
router.put('/:id', auth, validateObjectId, validateReview, reviewController.updateReview);

// Delete review (protected)
router.delete('/:id', auth, validateObjectId, reviewController.deleteReview);

module.exports = router;