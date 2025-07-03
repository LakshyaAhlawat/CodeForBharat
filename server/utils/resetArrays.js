const mongoose = require('mongoose');
const User = require('../models/User');
const Game = require('../models/Game');
const Review = require('../models/Review');

async function resetArrays() {
  try {
    // Don't connect if already connected (since server is running)
    if (mongoose.connection.readyState !== 1) {
      console.log('🔌 Database not connected, skipping array sync');
      return false;
    }

    console.log('🔄 Synchronizing user arrays...');

    // Reset all user arrays to empty first
    await User.updateMany({}, {
      $set: {
        gamesCreated: [],
        likedGames: [],
        reviewsGiven: [],
        reviewsReceived: []
      }
    });
    console.log('🧹 Cleared all user arrays');

    // Now rebuild them properly
    const users = await User.find({});
    
    for (const user of users) {
      console.log(`🔄 Processing ${user.username}...`);
      
      // Find user's games
      const games = await Game.find({ user: user._id });
      console.log(`  📊 Games created: ${games.length}`);
      
      // Find games user liked
      const likedGames = await Game.find({ likedBy: user._id });
      console.log(`  ❤️ Games liked: ${likedGames.length}`);
      
      // Find reviews user gave
      const reviewsGiven = await Review.find({ user: user._id });
      console.log(`  📝 Reviews given: ${reviewsGiven.length}`);
      
      // Find reviews user received (on their games)
      const reviewsReceived = await Review.find({ 
        game: { $in: games.map(g => g._id) } 
      });
      console.log(`  📥 Reviews received: ${reviewsReceived.length}`);
      
      // Update user with simple ObjectId arrays
      await User.findByIdAndUpdate(user._id, {
        gamesCreated: games.map(g => g._id),
        likedGames: likedGames.map(g => g._id),
        reviewsGiven: reviewsGiven.map(r => r._id),
        reviewsReceived: reviewsReceived.map(r => r._id),
        'gameStats.gamesCreated': games.length
      });
      
      console.log(`  ✅ Updated ${user.username}`);
    }
    
    console.log('🎉 Array sync completed!');
    return true;
    
  } catch (error) {
    console.error('❌ Array sync failed:', error.message);
    return false;
  }
}

// ✅ EXPORT THE FUNCTION
module.exports = resetArrays;

// ✅ ONLY RUN DIRECTLY IF THIS FILE IS EXECUTED
if (require.main === module) {
  // This runs when file is executed directly (node resetArrays.js)
  mongoose.connect(process.env.MONGODB_URI || process.env.DATABASE_URL)
    .then(() => {
      console.log('🔌 Connected to MongoDB');
      return resetArrays();
    })
    .then(() => {
      console.log('✅ Direct execution completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Direct execution failed:', error);
      process.exit(1);
    });
}