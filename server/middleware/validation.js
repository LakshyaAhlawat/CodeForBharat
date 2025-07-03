const User = require('../models/User');
const mongoose = require('mongoose');

// User registration validation
exports.validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Username, email, and password are required"
    });
  }

  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({
      success: false,
      message: "Username must be between 3 and 20 characters"
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address"
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long"
    });
  }

  next();
};

// User login validation
exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address"
    });
  }

  next();
};

// Profile update validation
exports.validateProfile = (req, res, next) => {
  const { displayName, bio } = req.body;

  if (displayName && displayName.length > 50) {
    return res.status(400).json({
      success: false,
      message: "Display name cannot exceed 50 characters"
    });
  }

  if (bio && bio.length > 500) {
    return res.status(400).json({
      success: false,
      message: "Bio cannot exceed 500 characters"
    });
  }

  next();
};

// Fixed Game validation for normal game creation
exports.validateGame = (req, res, next) => {
  const { title, description, gameData, type } = req.body;

  console.log('Validating game:', { title, description, type });

  if (!title || title.trim() === '') {
    return res.status(400).json({
      success: false,
      message: "Game title is required"
    });
  }

  if (title.length > 100) {
    return res.status(400).json({
      success: false,
      message: "Game title cannot exceed 100 characters"
    });
  }

  if (description && description.length > 500) {
    return res.status(400).json({
      success: false,
      message: "Game description cannot exceed 500 characters"
    });
  }

  next();
};

// Template game validation
exports.validateTemplateGame = (req, res, next) => {
  const { title, description, customizations } = req.body;

  console.log('Validating template game:', { title, description });

  if (!title || title.trim() === '') {
    return res.status(400).json({
      success: false,
      message: "Game title is required"
    });
  }

  if (title.length > 100) {
    return res.status(400).json({
      success: false,
      message: "Game title cannot exceed 100 characters"
    });
  }

  if (description && description.length > 500) {
    return res.status(400).json({
      success: false,
      message: "Game description cannot exceed 500 characters"
    });
  }

  next();
};

// Review validation
exports.validateReview = (req, res, next) => {
  const { rating } = req.body;

  if (!rating) {
    return res.status(400).json({
      success: false,
      message: "Rating is required"
    });
  }

  if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return res.status(400).json({
      success: false,
      message: "Rating must be an integer between 1 and 5"
    });
  }

  next();
};

// ObjectId validation
exports.validateObjectId = (req, res, next) => {
  const id = req.params.id || req.params.templateId || req.params.gameId;
  
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID parameter is required"
    });
  }
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  next();
};

// Check if user exists
exports.checkUserExists = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    req.userDetails = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error checking user existence"
    });
  }
};