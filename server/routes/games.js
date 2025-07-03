const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const reviewController = require('../controllers/reviewController');
const { auth, optionalAuth } = require('../middleware/auth');

console.log('🔗 Setting up game routes with review endpoints');

// Existing game routes
router.get('/', gameController.getAllGames);
router.get('/my-games', auth, gameController.getMyGames);
router.post('/', auth, gameController.uploadMiddleware, gameController.createGame);
router.get('/:id', gameController.getGame);
router.put('/:id', auth, gameController.uploadMiddleware, gameController.updateGame);
router.delete('/:id', auth, gameController.deleteGame);
router.post('/:id/like', auth, gameController.toggleLike);
router.post('/:id/play', gameController.recordPlay);
router.patch('/:id/visibility', auth, gameController.updateVisibility);

// ✅ REVIEW ROUTES - Add these
router.get('/:gameId/reviews', reviewController.getGameReviews);
router.post('/:gameId/reviews', auth, reviewController.addReview);
router.put('/reviews/:reviewId', auth, reviewController.updateReview);
router.delete('/reviews/:reviewId', auth, reviewController.deleteReview);

console.log('✅ Game routes with reviews configured');

module.exports = router;