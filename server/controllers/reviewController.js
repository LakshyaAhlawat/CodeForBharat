const Review = require('../models/Review');
const Game = require('../models/Game');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get game reviews
exports.getGameReviews = async (req, res) => {
  try {
    const { gameId } = req.params;
    
    console.log('🔍 Fetching reviews for game:', gameId);
    
    // Validate gameId
    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      console.log('❌ Invalid game ID:', gameId);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid game ID' 
      });
    }
    
    // Check if game exists
    const game = await Game.findById(gameId);
    if (!game) {
      console.log('❌ Game not found:', gameId);
      return res.status(404).json({ 
        success: false, 
        message: 'Game not found' 
      });
    }
    
    console.log('✅ Game found:', game.title);
    
    // Find reviews with detailed logging
    const reviews = await Review.find({ game: gameId })
      .populate('user', 'username email')
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${reviews.length} reviews for game ${gameId}`);
    
    // Log each review for debugging
    reviews.forEach((review, index) => {
      console.log(`   Review ${index + 1}:`, {
        id: review._id,
        user: review.user?.username,
        rating: review.rating,
        comment: review.comment?.substring(0, 50) + '...'
      });
    });
    
    res.json({
      success: true,
      reviews: reviews || [],
      count: reviews.length
    });
  } catch (error) {
    console.error('❌ Error fetching reviews:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching reviews',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Add game review
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { gameId } = req.params;

    console.log('📝 Adding review:', { 
      gameId, 
      rating, 
      comment: comment?.substring(0, 50) + '...', 
      userId: req.user?.id,
      userEmail: req.user?.email
    });

    // Validate gameId
    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      console.log('❌ Invalid game ID:', gameId);
      return res.status(400).json({
        success: false,
        message: 'Invalid game ID'
      });
    }

    // Validate user authentication
    if (!req.user || !req.user.id) {
      console.log('❌ User not authenticated:', req.user);
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Validate input
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      console.log('❌ Invalid rating:', rating, typeof rating);
      return res.status(400).json({
        success: false,
        message: 'Rating must be a number between 1 and 5'
      });
    }

    if (!comment || typeof comment !== 'string' || comment.trim().length < 5) {
      console.log('❌ Invalid comment:', comment);
      return res.status(400).json({
        success: false,
        message: 'Comment must be at least 5 characters long'
      });
    }

    // Check if game exists
    const game = await Game.findById(gameId);
    if (!game) {
      console.log('❌ Game not found:', gameId);
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    console.log('✅ Game found for review:', game.title);

    // Check if user already reviewed this game
    const existingReview = await Review.findOne({
      game: gameId,
      user: req.user.id
    });

    if (existingReview) {
      console.log('❌ User already reviewed this game:', { gameId, userId: req.user.id });
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this game'
      });
    }

    // Create new review
    const reviewData = {
      game: gameId,
      user: req.user.id,
      rating: parseInt(rating),
      comment: comment.trim()
    };

    console.log('💾 Creating review with data:', reviewData);

    const newReview = new Review(reviewData);
    const savedReview = await newReview.save();
    
    console.log('✅ Review saved successfully:', savedReview._id);
    
    // ✅ SIMPLE UPDATES - Just store the review ID
    await User.findByIdAndUpdate(req.user.id, { 
      $addToSet: { reviewsGiven: savedReview._id }
    });

    await User.findByIdAndUpdate(game.user, { 
      $addToSet: { reviewsReceived: savedReview._id }
    });

    console.log('✅ Updated user arrays with review ID:', savedReview._id);

    // Debug log
    const reviewerUser = await User.findById(req.user.id);
    const gameOwnerUser = await User.findById(game.user);
    console.log('👤 Reviewer reviews:', reviewerUser.reviewsGiven.length);
    console.log('👤 Game owner reviews received:', gameOwnerUser.reviewsReceived.length);

    // Then populate
    const populatedReview = await Review.findById(savedReview._id)
      .populate('user', 'username email');

    console.log('✅ Populated review:', {
      id: populatedReview._id,
      user: populatedReview.user?.username,
      rating: populatedReview.rating,
      comment: populatedReview.comment?.substring(0, 50) + '...'
    });

    res.status(201).json({
      success: true,
      review: populatedReview,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('❌ Error adding review:', error);
    console.error('❌ Error stack:', error.stack);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      console.log('❌ Validation errors:', messages);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    // Handle duplicate key error
    if (error.code === 11000) {
      console.log('❌ Duplicate review attempt');
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this game'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error adding review',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { reviewId } = req.params;

    console.log('📝 Updating review:', { reviewId, rating, comment: comment?.substring(0, 50) + '...', userId: req.user?.id });

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID'
      });
    }

    const updatedReview = await Review.findOneAndUpdate(
      { _id: reviewId, user: req.user.id },
      { 
        rating: parseInt(rating), 
        comment: comment.trim(),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('user', 'username email');

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or unauthorized'
      });
    }

    console.log('✅ Review updated successfully:', updatedReview._id);

    res.json({
      success: true,
      review: updatedReview,
      message: 'Review updated successfully'
    });
  } catch (error) {
    console.error('❌ Error updating review:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID'
      });
    }

    const deletedReview = await Review.findOneAndDelete({
      _id: reviewId,
      user: req.user.id
    });

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or unauthorized'
      });
    }

    console.log('✅ Review deleted successfully:', reviewId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};