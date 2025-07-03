const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Your existing sampleUsers array...
    const sampleUsers = [
      {
        username: 'gamemaster',
        email: 'gamemaster@codetogame.com',
        password: 'password123',
        profile: {
          displayName: 'Game Master',
          bio: 'I love creating amazing games with CodeToGame!',
          avatar: 'https://via.placeholder.com/150/4F46E5/FFFFFF?text=GM'
        }
      },
      {
        username: 'pixelartist',
        email: 'artist@codetogame.com',
        password: 'password123',
        profile: {
          displayName: 'Pixel Artist',
          bio: 'Creating beautiful pixel art games since 2020',
          avatar: 'https://via.placeholder.com/150/10B981/FFFFFF?text=PA'
        }
      },
      {
        username: 'developer123',
        email: 'dev@codetogame.com',
        password: 'password123',
        profile: {
          displayName: 'Code Developer',
          bio: 'Passionate about game development and teaching others',
          avatar: 'https://via.placeholder.com/150/F59E0B/FFFFFF?text=CD'
        }
      }
    ];

    // Create users
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      console.log(`Created user: ${user.username}`);
    }

    console.log('Users seeded successfully');
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

// ✅ ADD THIS EXPORT
module.exports = { seedUsers };

// Run if called directly
if (require.main === module) {
  seedUsers();
}