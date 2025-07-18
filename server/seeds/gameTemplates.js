const mongoose = require('mongoose');
const GameTemplate = require('../models/GameTemplate');
require('dotenv').config();

const gameTemplates = [
  {
    name: 'platformer',
    displayName: 'Platform Adventure',
    description: 'Classic side-scrolling platformer with jumping mechanics',
    type: 'platformer', // ✅ Make sure this is set
    thumbnail: '/templates/platformer-thumb.png',
    defaultConfig: {
      type: 'platformer', // ✅ And this too
      width: 800,
      height: 600,
      player: {
        speed: 160,
        jumpHeight: 400,
        sprite: 'player_platformer'
      },
      world: {
        gravity: 300,
        background: '#87CEEB',
        platforms: [
          { x: 0, y: 568, width: 800, height: 32, sprite: 'ground' },
          { x: 200, y: 450, width: 200, height: 32, sprite: 'platform' }
        ]
      },
      enemies: [
        { type: 'goomba', speed: 50, sprite: 'enemy_goomba', x: 300, y: 520, health: 1, points: 100 }
      ],
      collectibles: [
        { type: 'coin', points: 10, sprite: 'coin', x: 250, y: 400 }
      ],
      controls: { left: 'A', right: 'D', jump: 'SPACE' },
      gameRules: { winCondition: 'collect_all_coins', loseCondition: 'touch_enemy', lives: 3 }
    },
    isActive: true
  },
  {
    name: 'runner',
    displayName: 'Endless Runner',
    description: 'Fast-paced endless running game with obstacles',
    type: 'runner',
    thumbnail: '/templates/runner-thumb.png',
    defaultConfig: {
      type: 'runner',
      width: 800,
      height: 600,
      player: { speed: 200, jumpHeight: 350, sprite: 'player_runner' },
      world: { gravity: 400, background: '#FF6B6B', scrollSpeed: 150 },
      enemies: [
        { type: 'obstacle', speed: 0, sprite: 'spike', spawnRate: 2000, health: 1, points: 0 }
      ],
      collectibles: [
        { type: 'coin', points: 10, sprite: 'coin_runner', spawnRate: 1500 }
      ],
      controls: { jump: 'SPACE', slide: 'S' },
      gameRules: { winCondition: 'survive_time', loseCondition: 'touch_obstacle', endless: true }
    },
    isActive: true
  },
  {
    name: 'flappy',
    displayName: 'Flappy Bird Style',
    description: 'Navigate through pipes by flapping wings',
    type: 'flappy',
    thumbnail: '/templates/flappy-thumb.png',
    defaultConfig: {
      type: 'flappy',
      width: 800,
      height: 600,
      player: { speed: 0, jumpHeight: 300, sprite: 'bird', flapForce: -250 },
      world: { 
        gravity: 600, 
        background: '#70C5CE', 
        scrollSpeed: 120,
        backgroundType: 'day' // Make sure this is here
      },
      enemies: [
        { type: 'pipe_top', speed: 0, sprite: 'pipe_top', spawnRate: 2500, health: 1, points: 0 }
      ],
      collectibles: [
        { type: 'star', points: 1, sprite: 'star', spawnRate: 3000 }
      ],
      controls: { flap: 'SPACE' },
      gameRules: { winCondition: 'high_score', loseCondition: 'touch_pipe_or_ground', endless: true }
    },
    customizationOptions: {
      backgroundTypes: [
        { value: 'day', label: 'Day Sky', preview: '#87CEEB' },
        { value: 'night', label: 'Night Sky', preview: '#191970' },
        { value: 'sunset', label: 'Sunset', preview: '#FF6347' },
        { value: 'space', label: 'Space', preview: '#000000' },
        { value: 'forest', label: 'Forest', preview: '#228B22' }
      ]
    },
    isActive: true
  },
  {
    name: 'shooter',
    displayName: 'Space Shooter',
    description: 'Defend against waves of space invaders',
    type: 'shooter',
    thumbnail: '/templates/shooter-thumb.png',
    defaultConfig: {
      type: 'shooter',
      width: 800,
      height: 600,
      player: { speed: 200, jumpHeight: 0, sprite: 'spaceship', fireRate: 300 },
      world: { gravity: 0, background: '#000033' },
      enemies: [
        { type: 'alien_basic', speed: 50, sprite: 'alien1', spawnRate: 2000, health: 1, points: 10, fireRate: 1500 }
      ],
      collectibles: [
        { type: 'power_upgrade', points: 0, sprite: 'powerup_weapon', effect: 'double_shot', spawnRate: 10000 }
      ],
      controls: { left: 'A', right: 'D', up: 'W', down: 'S', shoot: 'SPACE' },
      gameRules: { winCondition: 'survive_waves', loseCondition: 'lose_all_lives', lives: 3, waves: 5 }
    },
    isActive: true
  }
];

const seedGameTemplates = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing templates
    await GameTemplate.deleteMany({});
    console.log('Cleared existing game templates');

    // Insert new templates
    await GameTemplate.insertMany(gameTemplates);
    console.log('Game templates seeded successfully');
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding game templates:', error);
    process.exit(1);
  }
};

// ✅ MAKE SURE YOU HAVE THIS EXPORT
module.exports = { seedGameTemplates };

// Run if called directly
if (require.main === module) {
  seedGameTemplates();
}