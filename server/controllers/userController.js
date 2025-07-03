const User = require('../models/User');
const Game = require('../models/Game');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id || req.user.id)
      .select('-password')
      .populate('gamesCreated.game', 'title status metadata shareId')
      .populate('likedGames.game', 'title creator');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { displayName, bio, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        'profile.displayName': displayName,
        'profile.bio': bio,
        'profile.avatar': avatar
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user dashboard
exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('gamesCreated.game', 'title status metadata')
      .populate('likedGames.game', 'title creator')
      .populate('reviewsGiven.game', 'title')
      .populate('reviewsReceived.game', 'title');

    res.json({
      success: true,
      dashboard: {
        profile: user.profile,
        gameStats: user.gameStats,
        gamesCreated: user.gamesCreated,
        likedGames: user.likedGames,
        recentReviewsGiven: user.reviewsGiven.slice(-5),
        recentReviewsReceived: user.reviewsReceived.slice(-5)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user's games
exports.getUserGames = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const games = await Game.find({ creator: req.params.id || req.user.id })
      .populate('creator', 'username profile.displayName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      games
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};