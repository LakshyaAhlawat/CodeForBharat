const Game = require('../models/Game');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = 'uploads/games/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

exports.uploadMiddleware = upload.single('thumbnail');

// Get all published games
exports.getAllGames = async (req, res) => {
  try {
    const games = await Game.find({ status: 'published' })
      .populate('user', 'username email')
      .sort({ createdAt: -1 });
    res.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ message: 'Error fetching games' });
  }
};

// Get user's games
exports.getMyGames = async (req, res) => {
  try {
    const games = await Game.find({ user: req.user.id })
      .populate('user', 'username email')
      .sort({ createdAt: -1 });
    res.json(games);
  } catch (error) {
    console.error('Error fetching user games:', error);
    res.status(500).json({ message: 'Error fetching games' });
  }
};

// Create new game - FIXED for FormData handling
exports.createGame = async (req, res) => {
  try {
    console.log('Creating game with data:', req.body);
    console.log('File uploaded:', req.file);
    
    let gameData, phaserConfig;
    
    // Handle FormData vs JSON
    if (req.body.gameData) {
      try {
        gameData = typeof req.body.gameData === 'string' ? JSON.parse(req.body.gameData) : req.body.gameData;
      } catch (e) {
        gameData = req.body.gameData || {};
      }
    }
    
    if (req.body.phaserConfig) {
      try {
        phaserConfig = typeof req.body.phaserConfig === 'string' ? JSON.parse(req.body.phaserConfig) : req.body.phaserConfig;
      } catch (e) {
        phaserConfig = req.body.phaserConfig || {};
      }
    }

    const { title, description, type } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Game title is required'
      });
    }

    const newGame = new Game({
      title: title.trim(),
      description: description || '',
      gameData: gameData || {},
      phaserConfig: phaserConfig || gameData || {},
      type: type || 'arcade',
      user: req.user.id,
      status: 'draft',
      assets: {
        thumbnail: req.file ? `/uploads/games/${req.file.filename}` : null
      },
      playCount: 0,
      likesCount: 0,
      likedBy: []
    });

    const savedGame = await newGame.save();

    // ✅ SIMPLE UPDATE
    await User.findByIdAndUpdate(req.user.id, { 
      $addToSet: { gamesCreated: savedGame._id },
      $inc: { 'gameStats.gamesCreated': 1 }
    });

    console.log('✅ Added game to user gamesCreated:', savedGame._id);

    const populatedGame = await Game.findById(savedGame._id)
      .populate('user', 'username email');
    
    console.log('Game created successfully:', populatedGame);
    res.status(201).json({
      success: true,
      game: populatedGame,
      message: 'Game created successfully'
    });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error creating game' 
    });
  }
};

// Get single game
exports.getGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate('user', 'username email');
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ message: 'Error fetching game' });
  }
};

// Update game
exports.updateGame = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // If there's a new thumbnail, update it
    if (req.file) {
      updateData['assets.thumbnail'] = `/uploads/games/${req.file.filename}`;
    }

    const updatedGame = await Game.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true }
    ).populate('user', 'username email');

    if (!updatedGame) {
      return res.status(404).json({ message: 'Game not found or unauthorized' });
    }

    res.json(updatedGame);
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(500).json({ message: 'Error updating game' });
  }
};

// Delete game
exports.deleteGame = async (req, res) => {
  try {
    const game = await Game.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found or unauthorized' });
    }

    await User.findByIdAndUpdate(
      req.user.id,
      { 
        $pull: { gamesCreated: { game: gameId } },
        $inc: { 'gameStats.gamesCreated': -1 }
      }
    );

    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ message: 'Error deleting game' });
  }
};

// Toggle like
exports.toggleLike = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const isLiked = game.likedBy.includes(req.user.id);
    
    if (isLiked) {
      game.likedBy.pull(req.user.id);
      game.likesCount = Math.max(0, game.likesCount - 1);
    } else {
      game.likedBy.push(req.user.id);
      game.likesCount += 1;
    }

    await game.save();
    if (isLiked) {
      // Remove like
      await User.findByIdAndUpdate(req.user.id, { 
        $pull: { likedGames: gameId }
      });
    } else {
      // Add like
      await User.findByIdAndUpdate(req.user.id, { 
        $addToSet: { likedGames: gameId }
      });
    }

    console.log('✅ Updated user likedGames');

    res.json({
      success: true,
      isLiked: !isLiked,
      likesCount: game.likesCount
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ message: 'Error toggling like' });
  }
};

// Record play
exports.recordPlay = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      { $inc: { playCount: 1 } },
      { new: true }
    );

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json({
      success: true,
      playCount: game.playCount
    });
  } catch (error) {
    console.error('Error recording play:', error);
    res.status(500).json({ message: 'Error recording play' });
  }
};

// Update game visibility
exports.updateVisibility = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['draft', 'published', 'private'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status. Must be draft, published, or private' 
      });
    }

    const game = await Game.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { 
        status,
        publishedAt: status === 'published' ? new Date() : null
      },
      { new: true }
    ).populate('user', 'username email');

    if (!game) {
      return res.status(404).json({ 
        success: false, 
        message: 'Game not found or unauthorized' 
      });
    }

    res.json({
      success: true,
      game,
      message: `Game ${status === 'published' ? 'published' : 'updated'} successfully`
    });
  } catch (error) {
    console.error('Error updating game visibility:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating game visibility' 
    });
  }
};

