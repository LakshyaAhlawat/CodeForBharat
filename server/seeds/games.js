const mongoose = require('mongoose');
const Game = require('../models/Game');
const User = require('../models/User');
require('dotenv').config();

const seedGames = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get sample users
    const users = await User.find().limit(3);
    if (users.length === 0) {
      console.log('No users found. Please seed users first.');
      process.exit(1);
    }

    // Clear existing games
    await Game.deleteMany({});
    console.log('Cleared existing games');

    const sampleGames = [
      {
        title: 'Super Platform Adventure',
        description: 'A classic platformer with exciting challenges and collectibles!',
        creator: users[0]._id,
        phaserConfig: {
          type: 'platformer',
          width: 800,
          height: 600,
          player: { speed: 160, jumpHeight: 400, sprite: 'hero' },
          world: { gravity: 300, background: '#87CEEB' },
          enemies: [{ type: 'goomba', speed: 50, sprite: 'enemy1', x: 300, y: 520 }],
          collectibles: [{ type: 'coin', points: 10, sprite: 'gold_coin', x: 200, y: 400 }]
        },
        status: 'published',
        shareId: 'platform001',
        metadata: {
          isPublic: true,
          playCount: 156,
          likes: [],
          rating: 4.5
        }
      },
      {
        title: 'Endless Space Runner',
        description: 'Run through space and avoid asteroids in this endless adventure!',
        creator: users[1]._id,
        phaserConfig: {
          type: 'runner',
          width: 800,
          height: 600,
          player: { speed: 200, jumpHeight: 350, sprite: 'astronaut' },
          world: { gravity: 400, background: '#000033', scrollSpeed: 150 },
          enemies: [{ type: 'asteroid', speed: 0, sprite: 'rock', spawnRate: 2000 }],
          collectibles: [{ type: 'star', points: 5, sprite: 'star', spawnRate: 1500 }]
        },
        status: 'published',
        shareId: 'runner001',
        metadata: {
          isPublic: true,
          playCount: 89,
          likes: [],
          rating: 4.2
        }
      },
      {
        title: 'Flappy Space Bird',
        description: 'Navigate your bird through space pipes in this challenging game!',
        creator: users[2]._id,
        phaserConfig: {
          type: 'flappy',
          width: 800,
          height: 600,
          player: { speed: 0, jumpHeight: 300, sprite: 'space_bird', flapForce: -250 },
          world: { gravity: 600, background: '#70C5CE', scrollSpeed: 120 },
          enemies: [{ type: 'pipe', speed: 0, sprite: 'metal_pipe', spawnRate: 2500 }],
          collectibles: [{ type: 'gem', points: 1, sprite: 'diamond', spawnRate: 3000 }]
        },
        status: 'published',
        shareId: 'flappy001',
        metadata: {
          isPublic: true,
          playCount: 234,
          likes: [],
          rating: 4.8
        }
      },
      {
        title: 'Alien Invasion Defense',
        description: 'Defend Earth from alien invaders in this action-packed shooter!',
        creator: users[0]._id,
        phaserConfig: {
          type: 'shooter',
          width: 800,
          height: 600,
          player: { speed: 200, jumpHeight: 0, sprite: 'spaceship', fireRate: 300 },
          world: { gravity: 0, background: '#000033' },
          enemies: [{ type: 'alien', speed: 50, sprite: 'ufo', spawnRate: 2000, health: 1, points: 10 }],
          collectibles: [{ type: 'powerup', points: 0, sprite: 'laser_upgrade', effect: 'double_shot' }]
        },
        status: 'published',
        shareId: 'shooter001',
        metadata: {
          isPublic: true,
          playCount: 178,
          likes: [],
          rating: 4.6
        }
      },
      {
        title: 'Work In Progress Game',
        description: 'This game is still being developed...',
        creator: users[1]._id,
        phaserConfig: {
          type: 'platformer',
          width: 800,
          height: 600,
          player: { speed: 160, jumpHeight: 400 },
          world: { gravity: 300, background: '#87CEEB' }
        },
        status: 'draft',
        metadata: {
          isPublic: false,
          playCount: 0,
          likes: [],
          rating: 0
        }
      }
    ];

    // Create games
    for (const gameData of sampleGames) {
      const game = new Game(gameData);
      await game.save();
      console.log(`Created game: ${game.title}`);
      
      // Update user's gamesCreated array
      await User.findByIdAndUpdate(game.creator, {
        $push: {
          gamesCreated: {
            game: game._id,
            title: game.title,
            status: game.status,
            playCount: game.metadata.playCount || 0,
            likes: game.metadata.likes?.length || 0
          }
        },
        $inc: { 'gameStats.gamesCreated': 1 }
      });
    }

    console.log('Games seeded successfully');
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding games:', error);
    process.exit(1);
  }
};

// ✅ ADD THIS EXPORT
module.exports = { seedGames };

// Run if called directly
if (require.main === module) {
  seedGames();
}