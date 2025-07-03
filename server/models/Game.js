const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  template: {
    type: String,
    required: false
  },
  gameData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  assets: {
    thumbnail: {
      type: String, // URL to uploaded image
      default: null
    },
    images: [{
      name: String,
      url: String,
      size: Number,
      uploadedAt: { type: Date, default: Date.now }
    }],
    sounds: [{
      name: String,
      url: String,
      size: Number,
      uploadedAt: { type: Date, default: Date.now }
    }]
  },
  type: {
    type: String,
    enum: ['platformer', 'shooter', 'runner', 'flappy', 'arcade', 'puzzle', 'quiz'],
    default: 'arcade'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'private'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  playCount: {
    type: Number,
    default: 0
  },
  likesCount: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  shareId: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

gameSchema.pre('save', function(next) {
  if (!this.shareId) {
    this.shareId = this._id.toString();
  }
  
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

module.exports = mongoose.model('Game', gameSchema);