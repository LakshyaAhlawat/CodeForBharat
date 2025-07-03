const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  game: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Game', 
    required: true 
  },
  user: { // Make sure this matches your controller (not 'reviewer')
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5, 
    required: true 
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 500
  }
}, { timestamps: true });

// Ensure a user can only review a game once
reviewSchema.index({ game: 1, user: 1 }, { unique: true });

// Add some logging for debugging
reviewSchema.pre('save', function(next) {
  console.log('💾 Saving review:', {
    game: this.game,
    user: this.user,
    rating: this.rating,
    comment: this.comment?.substring(0, 50) + '...'
  });
  next();
});

reviewSchema.post('save', function(doc) {
  console.log('✅ Review saved to database:', doc._id);
});

module.exports = mongoose.model('Review', reviewSchema);