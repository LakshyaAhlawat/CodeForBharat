export const gameTemplates = {
  platformer: {
    id: 'platformer',
    name: 'Platform Adventure',
    description: 'Jump, collect coins, and avoid enemies across multiple levels',
    icon: '🏃‍♂️',
    component: 'PlatformerGameCore',
    category: 'adventure',
    difficulty: 'medium',
    defaultSettings: {
      width: 800,
      height: 600,
      backgroundColor: '#87CEEB',
      playerSpeed: 160,
      jumpForce: -400,
      maxLevels: 10,
      startingLives: 3
    },
    customizableSettings: [
      {
        key: 'player.speed',
        label: 'Player Speed',
        type: 'range',
        min: 100,
        max: 300,
        step: 20,
        description: 'How fast the player moves'
      },
      {
        key: 'player.jumpHeight',
        label: 'Jump Height',
        type: 'range',
        min: 200,
        max: 600,
        step: 25,
        description: 'How high the player jumps'
      },
      {
        key: 'world.gravity',
        label: 'Gravity',
        type: 'range',
        min: 200,
        max: 800,
        step: 50,
        description: 'World gravity strength'
      },
      {
        key: 'gameRules.lives',
        label: 'Starting Lives',
        type: 'range',
        min: 1,
        max: 10,
        step: 1,
        description: 'Number of lives player starts with'
      },
      {
        key: 'world.background',
        label: 'Background Color',
        type: 'color',
        description: 'Background color'
      }
    ]
  },

  flappy: {
    id: 'flappy',
    name: 'Flappy Bird Style',
    description: 'Navigate through pipes by flapping wings',
    icon: '🐦',
    component: 'FlappyBirdCore',
    category: 'arcade',
    difficulty: 'easy'
  },

  runner: {
    id: 'runner',
    name: 'Endless Runner',
    description: 'Fast-paced endless running game with obstacles',
    icon: '🏃‍♀️',
    component: 'RunnerCore',
    category: 'arcade',
    difficulty: 'medium'
  },

  shooter: {
    id: 'shooter',
    name: 'Space Shooter',
    description: 'Defend against waves of space invaders',
    icon: '🚀',
    component: 'ShooterCore',
    category: 'action',
    difficulty: 'hard'
  }
};

export const getGameTemplate = (templateId) => {
  return gameTemplates[templateId] || null;
};

export const getAllGameTemplates = () => {
  return Object.values(gameTemplates);
};

export const getGameTemplatesByCategory = (category) => {
  return Object.values(gameTemplates).filter(template => template.category === category);
};