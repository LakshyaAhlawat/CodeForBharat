const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { validateObjectId } = require('../middleware/validation');

// Get public game by share ID
router.get('/games/:shareId', (req, res, next) => {
  // Find game by shareId instead of _id
  req.params.id = req.params.shareId;
  next();
}, gameController.getGame);

// Play public game (record play count)
router.post('/games/:shareId/play', (req, res, next) => {
  req.params.id = req.params.shareId;
  next();
}, gameController.recordPlay);

// Get featured games
router.get('/featured', (req, res) => {
  // Add query filter for featured games
  req.query.featured = 'true';
  gameController.getAllGames(req, res);
});

// Get trending games (most played)
router.get('/trending', (req, res) => {
  // Add sorting by play count
  req.query.sortBy = 'playCount';
  req.query.order = 'desc';
  gameController.getAllGames(req, res);
});

module.exports = router;