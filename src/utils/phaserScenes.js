// src/utils/phaserScenes.js
import { createBirdSprite, createPipeSprite, createPlayerSprite, createPlatformSprite, createEnemySprite, createCoinSprite, createBackgroundSprite } from './spriteCreators';

export const createFlappyScene = (gameData, onScoreUpdate, onGameOver) => {
  return {
    key: 'FlappyScene',
    
    preload: function() {
      this.load.image('bird', createBirdSprite(gameData.player?.color || '#FFD700'));
      this.load.image('pipe', createPipeSprite());
      this.load.image('background', createBackgroundSprite(gameData.world?.background));
    },
    
    create: function() {
      const scene = this;
      
      // Background
      scene.add.image(400, 300, 'background').setScale(2);
      
      // Game variables
      scene.gameActive = false;
      scene.gameStarted = false;
      scene.gameScore = 0;
      scene.highScore = parseInt(localStorage.getItem('flappy-high-score') || '0');
      scene.pipeSpeed = gameData.world?.scrollSpeed || 150;
      scene.flapForce = gameData.player?.flapForce || -250;
      
      // Create bird
      scene.bird = scene.physics.add.sprite(100, 300, 'bird');
      scene.bird.setScale(0.8);
      scene.bird.setCollideWorldBounds(false);
      scene.bird.body.setSize(40, 40);
      
      // Create pipes group
      scene.pipes = scene.physics.add.group();
      
      // UI Elements
      scene.scoreText = scene.add.text(400, 50, '0', {
        fontSize: '48px',
        fontFamily: 'Arial Black',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
      }).setOrigin(0.5);
      
      scene.instructionText = scene.add.text(400, 400, 'TAP SPACE or CLICK to FLY!', {
        fontSize: '24px',
        fontFamily: 'Arial Black',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3
      }).setOrigin(0.5);
      
      // Input handling
      scene.input.on('pointerdown', () => scene.flap());
      scene.input.keyboard.on('keydown-SPACE', () => scene.flap());
      
      // Game methods
      scene.flap = function() {
        if (!scene.gameStarted) {
          scene.startGame();
        } else if (scene.gameActive) {
          scene.bird.setVelocityY(scene.flapForce);
        } else {
          scene.restartGame();
        }
      };
      
      scene.startGame = function() {
        scene.gameStarted = true;
        scene.gameActive = true;
        scene.instructionText.setVisible(false);
        scene.bird.setVelocityY(scene.flapForce);
        
        // Start pipe spawning
        scene.pipeTimer = scene.time.addEvent({
          delay: 2000,
          callback: scene.spawnPipe,
          callbackScope: scene,
          loop: true
        });
      };
      
      scene.spawnPipe = function() {
        if (!scene.gameActive) return;
        
        const pipeY = Phaser.Math.Between(150, 450);
        const gap = 150;
        
        // Top pipe
        const topPipe = scene.pipes.create(850, pipeY - 200, 'pipe');
        topPipe.setOrigin(0, 1);
        topPipe.body.setSize(60, 400);
        topPipe.setVelocityX(-scene.pipeSpeed);
        topPipe.setTint(0x228B22);
        
        // Bottom pipe
        const bottomPipe = scene.pipes.create(850, pipeY + gap, 'pipe');
        bottomPipe.setOrigin(0, 0);
        bottomPipe.body.setSize(60, 400);
        bottomPipe.setVelocityX(-scene.pipeSpeed);
        bottomPipe.setTint(0x228B22);
        bottomPipe.flipY = true;
        
        // Add score zone
        topPipe.scored = false;
      };
      
      scene.addScore = function() {
        scene.gameScore++;
        scene.scoreText.setText(scene.gameScore);
        
        if (onScoreUpdate) {
          onScoreUpdate(scene.gameScore);
        }
      };
      
      scene.gameOver = function() {
        scene.gameActive = false;
        if (scene.pipeTimer) scene.pipeTimer.destroy();
        
        // Check high score
        const isNewHighScore = scene.gameScore > scene.highScore;
        if (isNewHighScore) {
          scene.highScore = scene.gameScore;
          localStorage.setItem('flappy-high-score', scene.highScore.toString());
        }
        
        // Stop all pipes
        scene.pipes.children.entries.forEach(pipe => {
          pipe.body.setVelocityX(0);
        });
        
        if (onGameOver) {
          onGameOver(scene.gameScore, scene.highScore);
        }
      };
      
      scene.restartGame = function() {
        scene.gameScore = 0;
        scene.scoreText.setText('0');
        scene.bird.setPosition(100, 300);
        scene.bird.setVelocity(0, 0);
        scene.pipes.clear(true, true);
        scene.instructionText.setVisible(true);
        scene.gameStarted = false;
        scene.gameActive = false;
      };
      
      // Collision detection
      scene.physics.add.collider(scene.bird, scene.pipes, scene.gameOver, null, scene);
    },
    
    update: function() {
      if (!this.gameActive) return;
      
      // Check bounds
      if (this.bird.y > 600 || this.bird.y < 0) {
        this.gameOver();
      }
      
      // Clean up pipes and check scoring
      this.pipes.children.entries.forEach(pipe => {
        if (pipe.x < -100) {
          pipe.destroy();
        }
        
        // Score when bird passes pipe
        if (!pipe.scored && pipe.x < this.bird.x - 30) {
          pipe.scored = true;
          this.addScore();
        }
      });
      
      // Bird rotation
      if (this.bird.body.velocity.y < 0) {
        this.bird.setRotation(-0.3);
      } else {
        this.bird.setRotation(Math.min(0.5, this.bird.body.velocity.y * 0.01));
      }
    }
  };
};

export const createPlatformerScene = (gameData, onScoreUpdate, onGameOver) => {
  // Platformer scene implementation
  return {
    key: 'PlatformerScene',
    // ... platformer game logic
  };
};

export const createRunnerScene = (gameData, onScoreUpdate, onGameOver) => {
  // Runner scene implementation
  return {
    key: 'RunnerScene',
    // ... runner game logic
  };
};

export const createShooterScene = (gameData, onScoreUpdate, onGameOver) => {
  // Shooter scene implementation
  return {
    key: 'ShooterScene',
    // ... shooter game logic
  };
};