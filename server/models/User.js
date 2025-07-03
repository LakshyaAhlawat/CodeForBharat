const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profile: {
    displayName: String,
    bio: String,
    avatar: String
  },
  gameStats: {
    gamesCreated: { type: Number, default: 0 },
    gamesPublished: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
    totalPlays: { type: Number, default: 0 }
  },
  // ✅ SIMPLIFIED - Just store IDs
  gamesCreated: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Game' 
  }],
  likedGames: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Game' 
  }],
  reviewsGiven: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Review' 
  }],
  reviewsReceived: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Review' 
  }]
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);