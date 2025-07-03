// Generate Phaser-compatible game configuration
const generatePhaserConfig = (gameData) => {
  const { phaserConfig, assets = { sprites: [], sounds: [], backgrounds: [] } } = gameData;

  return {
    type: Phaser.AUTO,
    width: phaserConfig.width || 800,
    height: phaserConfig.height || 600,
    backgroundColor: phaserConfig.world?.background || '#87CEEB',
    
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: phaserConfig.world?.gravity || 300 },
        debug: false
      }
    },

    scene: {
      key: 'GameScene',
      
      preload: function() {
        // Load player sprite
        if (phaserConfig.player?.sprite) {
          this.load.image('player', getAssetUrl(assets.sprites, phaserConfig.player.sprite));
        } else {
          // Default player sprite (colored rectangle)
          this.load.image('player', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
        }

        // Load enemy sprites
        phaserConfig.enemies?.forEach(enemy => {
          if (enemy.sprite) {
            this.load.image(enemy.type, getAssetUrl(assets.sprites, enemy.sprite));
          }
        });

        // Load collectible sprites
        phaserConfig.collectibles?.forEach(collectible => {
          if (collectible.sprite) {
            this.load.image(collectible.type, getAssetUrl(assets.sprites, collectible.sprite));
          }
        });

        // Load platform sprites
        this.load.image('platform', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
        
        // Load sounds
        assets.sounds?.forEach(sound => {
          this.load.audio(sound.key, sound.url);
        });

        // Load background
        if (assets.backgrounds?.length > 0) {
          this.load.image('background', assets.backgrounds[0].url);
        }
      },

      create: function() {
        const scene = this;
        
        // Add background
        if (assets.backgrounds?.length > 0) {
          scene.add.image(400, 300, 'background').setScale(0.5);
        }

        // Create platforms
        scene.platforms = scene.physics.add.staticGroup();
        
        // Add ground
        scene.platforms.create(400, 568, 'platform').setScale(800, 32).refreshBody();
        
        // Add other platforms from config
        phaserConfig.world?.platforms?.forEach(platform => {
          scene.platforms.create(
            platform.x + platform.width/2, 
            platform.y + platform.height/2, 
            'platform'
          ).setScale(platform.width, platform.height).refreshBody();
        });

        // Create player
        scene.player = scene.physics.add.sprite(100, 450, 'player');
        scene.player.setBounce(0.2);
        scene.player.setCollideWorldBounds(true);
        scene.physics.add.collider(scene.player, scene.platforms);

        // Create enemies
        scene.enemies = scene.physics.add.group();
        phaserConfig.enemies?.forEach(enemyConfig => {
          const enemy = scene.enemies.create(enemyConfig.x || 300, enemyConfig.y || 450, enemyConfig.type);
          enemy.setBounce(1);
          enemy.setVelocity(enemyConfig.speed || 50, 0);
          enemy.setCollideWorldBounds(true);
          scene.physics.add.collider(enemy, scene.platforms);
        });

        // Create collectibles
        scene.collectibles = scene.physics.add.group();
        phaserConfig.collectibles?.forEach(collectibleConfig => {
          const collectible = scene.collectibles.create(
            collectibleConfig.x || 200, 
            collectibleConfig.y || 400, 
            collectibleConfig.type
          );
          collectible.setBounce(0.4);
          scene.physics.add.collider(collectible, scene.platforms);
        });

        // Player-collectible collision
        scene.physics.add.overlap(scene.player, scene.collectibles, (player, collectible) => {
          collectible.disableBody(true, true);
          scene.score += collectible.points || 10;
          scene.scoreText.setText('Score: ' + scene.score);
        });

        // Player-enemy collision
        scene.physics.add.collider(scene.player, scene.enemies, (player, enemy) => {
          scene.gameOver();
        });

        // Score display
        scene.score = 0;
        scene.scoreText = scene.add.text(16, 16, 'Score: 0', {
          fontSize: '32px',
          fill: '#000'
        });

        // Controls
        scene.cursors = scene.input.keyboard.createCursorKeys();
        scene.wasd = scene.input.keyboard.addKeys('W,S,A,D');
        scene.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      },

      update: function() {
        const scene = this;
        
        if (!scene.player.active) return;

        // Player movement based on game type
        if (phaserConfig.type === 'platformer') {
          // Platformer controls
          if (scene.cursors.left.isDown || scene.wasd.A.isDown) {
            scene.player.setVelocityX(-160);
          } else if (scene.cursors.right.isDown || scene.wasd.D.isDown) {
            scene.player.setVelocityX(160);
          } else {
            scene.player.setVelocityX(0);
          }

          if ((scene.cursors.up.isDown || scene.spaceKey.isDown) && scene.player.body.touching.down) {
            scene.player.setVelocityY(-330);
          }
        } else if (phaserConfig.type === 'flappy') {
          // Flappy controls
          if (Phaser.Input.Keyboard.JustDown(scene.spaceKey)) {
            scene.player.setVelocityY(-250);
          }
        } else if (phaserConfig.type === 'shooter') {
          // Shooter controls
          if (scene.cursors.left.isDown || scene.wasd.A.isDown) {
            scene.player.setVelocityX(-200);
          } else if (scene.cursors.right.isDown || scene.wasd.D.isDown) {
            scene.player.setVelocityX(200);
          } else {
            scene.player.setVelocityX(0);
          }

          if (scene.cursors.up.isDown || scene.wasd.W.isDown) {
            scene.player.setVelocityY(-200);
          } else if (scene.cursors.down.isDown || scene.wasd.S.isDown) {
            scene.player.setVelocityY(200);
          } else {
            scene.player.setVelocityY(0);
          }
        }
      },

      gameOver: function() {
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.gameOverText = this.add.text(400, 300, 'Game Over!', {
          fontSize: '48px',
          fill: '#ff0000'
        }).setOrigin(0.5);
      }
    }
  };
};

// Helper function to get asset URL
const getAssetUrl = (assets, assetKey) => {
  const asset = assets.find(a => a.key === assetKey);
  return asset ? asset.url : null;
};

// Generate game data for frontend
const generateGameForFrontend = (gameData) => {
  return {
    id: gameData._id,
    title: gameData.title,
    description: gameData.description,
    config: generatePhaserConfig(gameData),
    metadata: {
      creator: gameData.creator,
      playCount: gameData.metadata.playCount,
      likes: gameData.metadata.likes?.length || 0,
      rating: gameData.metadata.rating
    }
  };
};

// Generate embeddable game code
const generateEmbedCode = (shareId, width = 800, height = 600) => {
  const embedUrl = `${process.env.FRONTEND_URL}/embed/${shareId}`;
  
  return `<iframe 
    src="${embedUrl}" 
    width="${width}" 
    height="${height}" 
    frameborder="0" 
    allowfullscreen>
  </iframe>`;
};

// Validate game configuration
const validateGameConfig = (phaserConfig) => {
  const errors = [];

  // Check required fields
  if (!phaserConfig.type) {
    errors.push('Game type is required');
  }

  if (!['platformer', 'runner', 'flappy', 'shooter'].includes(phaserConfig.type)) {
    errors.push('Invalid game type');
  }

  // Check dimensions
  if (phaserConfig.width < 400 || phaserConfig.width > 1920) {
    errors.push('Width must be between 400 and 1920 pixels');
  }

  if (phaserConfig.height < 300 || phaserConfig.height > 1080) {
    errors.push('Height must be between 300 and 1080 pixels');
  }

  // Check player config
  if (phaserConfig.player) {
    if (phaserConfig.player.speed < 50 || phaserConfig.player.speed > 500) {
      errors.push('Player speed must be between 50 and 500');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Generate random game variation
const generateRandomVariation = (baseTemplate) => {
  const variation = JSON.parse(JSON.stringify(baseTemplate));
  
  // Randomize some properties
  if (variation.world) {
    // Random background colors
    const colors = ['#87CEEB', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];
    variation.world.background = colors[Math.floor(Math.random() * colors.length)];
    
    // Random gravity
    variation.world.gravity = 200 + Math.random() * 400;
  }

  if (variation.player) {
    // Random player speed
    variation.player.speed = 120 + Math.random() * 160;
    variation.player.jumpHeight = 300 + Math.random() * 200;
  }

  return variation;
};

module.exports = {
  generatePhaserConfig,
  generateGameForFrontend,
  generateEmbedCode,
  validateGameConfig,
  generateRandomVariation
};