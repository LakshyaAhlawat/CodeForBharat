import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

const PlatformerGameCore = ({ 
  gameConfig = {},
  onScoreUpdate,
  onGameOver,
  customSettings = {} 
}) => {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);

  // Merge server config with custom settings
  const settings = {
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB',
    playerSpeed: 160,
    jumpForce: -400,
    maxLevels: 10,
    startingLives: 3,
    ...gameConfig.defaultConfig,
    ...customSettings
  };

  useEffect(() => {
    if (!gameRef.current) return;

    // Clean up previous game
    if (phaserGameRef.current) {
      phaserGameRef.current.destroy(true);
      phaserGameRef.current = null;
    }

    let gameVars = {
      score: 0,
      lives: settings.startingLives || 3,
      level: 1,
      gameState: 'waiting'
    };

    class PlatformerScene extends Phaser.Scene {
      constructor() {
        super({ key: 'PlatformerScene' });
      }

      preload() {
        console.log('📥 Creating platformer sprites...');
        
        // Create player sprite
        const playerGraphics = this.add.graphics();
        const playerColor = settings.player?.color ? 
          parseInt(settings.player.color.replace('#', '0x')) : 0x4CAF50;
        
        playerGraphics.fillStyle(playerColor);
        playerGraphics.fillRect(0, 0, 32, 40);
        // Player face
        playerGraphics.fillStyle(0xFFFFFF);
        playerGraphics.fillRect(6, 6, 20, 14);
        // Eyes
        playerGraphics.fillStyle(0x000000);
        playerGraphics.fillCircle(12, 12, 3);
        playerGraphics.fillCircle(20, 12, 3);
        // Mouth
        playerGraphics.fillStyle(0xFF0000);
        playerGraphics.fillRect(10, 16, 12, 2);
        
        playerGraphics.generateTexture('player', 32, 40);
        playerGraphics.destroy();

        // Create platform sprite
        const platformGraphics = this.add.graphics();
        platformGraphics.fillStyle(0x228B22);
        platformGraphics.fillRect(0, 0, 64, 32);
        // Add texture to platform
        platformGraphics.fillStyle(0x32CD32);
        platformGraphics.fillRect(0, 0, 64, 8);
        platformGraphics.generateTexture('platform', 64, 32);
        platformGraphics.destroy();

        // Create enemy sprite
        const enemyGraphics = this.add.graphics();
        enemyGraphics.fillStyle(0xFF4444);
        enemyGraphics.fillRect(0, 0, 30, 30);
        // Enemy face
        enemyGraphics.fillStyle(0xFFFFFF);
        enemyGraphics.fillRect(6, 8, 8, 8);
        enemyGraphics.fillRect(16, 8, 8, 8);
        enemyGraphics.fillStyle(0xFF0000);
        enemyGraphics.fillCircle(10, 12, 3);
        enemyGraphics.fillCircle(20, 12, 3);
        // Angry mouth
        enemyGraphics.fillStyle(0x000000);
        enemyGraphics.fillRect(8, 20, 14, 4);
        
        enemyGraphics.generateTexture('enemy', 30, 30);
        enemyGraphics.destroy();

        // Create coin sprite
        const coinGraphics = this.add.graphics();
        coinGraphics.fillStyle(0xFFD700);
        coinGraphics.fillCircle(12, 12, 12);
        // Inner circle
        coinGraphics.fillStyle(0xFFA500);
        coinGraphics.fillCircle(12, 12, 8);
        // Star pattern
        coinGraphics.fillStyle(0xFFD700);
        const centerX = 12, centerY = 12, size = 4;
        coinGraphics.fillTriangle(centerX, centerY - size, centerX - 2, centerY, centerX + 2, centerY);
        coinGraphics.fillTriangle(centerX, centerY + size, centerX - 2, centerY, centerX + 2, centerY);
        
        coinGraphics.generateTexture('coin', 24, 24);
        coinGraphics.destroy();

        console.log('✅ Platformer sprites created');
      }

      create() {
        console.log('🎨 Creating platformer world...');
        
        this.physics.world.setBounds(0, 0, settings.width, settings.height);
        this.levelCompleting = false;

        // Background
        const bgColor = settings.world?.background ? 
          parseInt(settings.world.background.replace('#', '0x')) : 0x87CEEB;
        this.add.rectangle(settings.width/2, settings.height/2, settings.width, settings.height, bgColor);

        // Add clouds for atmosphere
        for (let i = 0; i < 5; i++) {
          const x = (i * 150 + 100) % settings.width;
          const y = 50 + (i % 3) * 30;
          this.add.circle(x, y, 20 + Math.random() * 10, 0xFFFFFF, 0.8);
          this.add.circle(x + 15, y, 25 + Math.random() * 8, 0xFFFFFF, 0.8);
          this.add.circle(x + 30, y, 18 + Math.random() * 7, 0xFFFFFF, 0.8);
        }

        // Create groups
        this.platforms = this.physics.add.staticGroup();
        this.enemies = this.physics.add.group();
        this.coins = this.physics.add.group();

        // Player
        this.player = this.physics.add.sprite(100, settings.height - 150, 'player');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(settings.world?.gravity || 600);
        this.player.setMaxVelocity(300, 800);

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D,SPACE');

        this.createUI();
        this.setupLevel(1);

        // Collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

        this.showStartScreen();

        // Input handlers
        this.input.on('pointerdown', () => {
          if (gameVars.gameState === 'waiting') {
            this.startGame();
          }
        });

        this.input.keyboard.on('keydown-SPACE', () => {
          if (gameVars.gameState === 'waiting') {
            this.startGame();
          }
        });

        console.log('✅ Platformer world created!');
      }

      setupLevel(levelNum) {
        console.log(`🔧 Setting up level ${levelNum}...`);
        this.levelCompleting = false;
        
        // Clear existing objects
        if (this.platforms) this.platforms.clear(true, true);
        if (this.enemies) this.enemies.clear(true, true);
        if (this.coins) this.coins.clear(true, true);

        // Create ground
        const ground = this.platforms.create(settings.width/2, settings.height - 20, 'platform');
        ground.setScale(Math.ceil(settings.width/64), 1.25).refreshBody();

        // Use server config platforms if available
        if (settings.world?.platforms && settings.world.platforms.length > 1) {
          settings.world.platforms.forEach((platform, index) => {
            if (index === 0) return; // Skip ground platform
            const p = this.platforms.create(
              platform.x + platform.width/2, 
              platform.y + platform.height/2, 
              'platform'
            );
            p.setScale(platform.width/64, platform.height/32).refreshBody();
          });
        } else {
          // Dynamic level generation
          for(let i = 0; i < 3 + levelNum; i++) {
            const x = 150 + (i * 180);
            const y = settings.height - 150 - (i * 40);
            this.platforms.create(x, y, 'platform').setScale(2, 1).refreshBody();
          }
        }

        // Create enemies from server config or generate
        if (settings.enemies && settings.enemies.length > 0) {
          settings.enemies.forEach(enemyConfig => {
            const x = enemyConfig.x || 300 + Math.random() * 200;
            const y = enemyConfig.y || settings.height - 200;
            const enemy = this.enemies.create(x, y, 'enemy');
            
            enemy.setBounce(0.3);
            enemy.setGravityY(settings.world?.gravity || 600);
            enemy.setVelocity((enemyConfig.speed || 50) + levelNum * 10, 0);
            enemy.setCollideWorldBounds(true);
            
            // Enemy AI properties
            enemy.chaseSpeed = (enemyConfig.speed || 50) + levelNum * 10;
            enemy.detectionRange = 150;
            enemy.patrolLeft = Math.max(30, x - 100);
            enemy.patrolRight = Math.min(settings.width - 30, x + 100);
            enemy.patrolDirection = 1;
          });
        } else {
          // Default enemy generation
          for(let i = 0; i < 2 + Math.floor(levelNum/2); i++) {
            const x = 200 + (i * 150);
            const y = settings.height - 200;
            const enemy = this.enemies.create(x, y, 'enemy');
            
            enemy.setBounce(0.3);
            enemy.setGravityY(settings.world?.gravity || 600);
            enemy.setVelocity(50 + levelNum * 10, 0);
            enemy.setCollideWorldBounds(true);
            
            enemy.chaseSpeed = 50 + levelNum * 10;
            enemy.detectionRange = 150;
            enemy.patrolLeft = Math.max(30, x - 100);
            enemy.patrolRight = Math.min(settings.width - 30, x + 100);
            enemy.patrolDirection = 1;
          }
        }

        // Create coins from server config or generate
        if (settings.collectibles && settings.collectibles.length > 0) {
          settings.collectibles.forEach(coin => {
            const coinSprite = this.coins.create(coin.x || 250, coin.y || settings.height - 200, 'coin');
            
            // Coin animation
            this.tweens.add({
              targets: coinSprite,
              y: coinSprite.y - 15,
              duration: 1500,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut'
            });
            
            this.tweens.add({
              targets: coinSprite,
              rotation: Math.PI * 2,
              duration: 2000,
              repeat: -1,
              ease: 'Linear'
            });
          });
        } else {
          // Default coin generation
          for(let i = 0; i < 3 + levelNum; i++) {
            const x = 150 + (i * 180);
            const y = settings.height - 200 - (i * 30);
            const coinSprite = this.coins.create(x, y, 'coin');
            
            // Coin animations
            this.tweens.add({
              targets: coinSprite,
              y: y - 15,
              duration: 1500,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut'
            });
            
            this.tweens.add({
              targets: coinSprite,
              rotation: Math.PI * 2,
              duration: 2000,
              repeat: -1,
              ease: 'Linear'
            });
          }
        }

        this.updateUI();
        console.log(`✅ Level ${levelNum} setup complete!`);
      }

      createUI() {
        this.scoreText = this.add.text(20, 20, `Score: ${gameVars.score}`, {
          fontSize: '24px',
          fill: '#FFFFFF',
          stroke: '#000000',
          strokeThickness: 4
        });

        this.livesText = this.add.text(20, 50, `Lives: ${gameVars.lives}`, {
          fontSize: '24px',
          fill: '#FFFFFF',
          stroke: '#000000',
          strokeThickness: 4
        });

        this.levelText = this.add.text(20, 80, `Level: ${gameVars.level}`, {
          fontSize: '24px',
          fill: '#FFFFFF',
          stroke: '#000000',
          strokeThickness: 4
        });

        this.collectText = this.add.text(settings.width - 180, 20, 'Collect: 0', {
          fontSize: '24px',
          fill: '#FFFFFF',
          stroke: '#000000',
          strokeThickness: 4
        });
      }

      showStartScreen() {
        this.startScreen = this.add.container(settings.width/2, settings.height/2);
        
        const bg = this.add.rectangle(0, 0, 500, 300, 0x000000, 0.9);
        const title = this.add.text(0, -80, 'Platform Adventure', {
          fontSize: '32px',
          fill: '#FFFFFF',
          stroke: '#000000',
          strokeThickness: 4
        }).setOrigin(0.5);
        
        const subtitle = this.add.text(0, -40, 'Custom Template Game', {
          fontSize: '18px',
          fill: '#00FF00'
        }).setOrigin(0.5);
        
        const instructions = this.add.text(0, -10, 'Arrow Keys or WASD to Move\nSPACE to Jump', {
          fontSize: '16px',
          fill: '#FFFF00',
          align: 'center'
        }).setOrigin(0.5);
        
        const startText = this.add.text(0, 40, 'CLICK or PRESS SPACE to Start!', {
          fontSize: '24px',
          fill: '#FFD700',
          stroke: '#000000',
          strokeThickness: 2
        }).setOrigin(0.5);
        
        this.startScreen.add([bg, title, subtitle, instructions, startText]);
        
        // Blinking animation
        this.tweens.add({
          targets: startText,
          alpha: 0.3,
          duration: 800,
          yoyo: true,
          repeat: -1
        });
      }

      startGame() {
        gameVars.gameState = 'playing';
        if (this.startScreen) {
          this.startScreen.destroy();
        }
        console.log('🎮 Game started!');
      }

      update() {
        if (gameVars.gameState !== 'playing') return;

        const playerSpeed = settings.player?.speed || 160;
        const jumpHeight = Math.abs(settings.player?.jumpHeight || 400);

        // Player movement
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
          this.player.setVelocityX(-playerSpeed);
          this.player.setFlipX(true);
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
          this.player.setVelocityX(playerSpeed);
          this.player.setFlipX(false);
        } else {
          this.player.setVelocityX(0);
        }

        if ((this.cursors.up.isDown || this.wasd.W.isDown || this.wasd.SPACE.isDown) && this.player.body.touching.down) {
          this.player.setVelocityY(-jumpHeight);
        }

        // Enemy AI
        this.enemies.children.entries.forEach(enemy => {
          if (!enemy.active) return;
          
          const distanceToPlayer = Phaser.Math.Distance.Between(
            enemy.x, enemy.y, this.player.x, this.player.y
          );
          
          if (distanceToPlayer < enemy.detectionRange) {
            // Chase mode
            if (this.player.x < enemy.x - 10) {
              enemy.setVelocityX(-enemy.chaseSpeed);
              enemy.setFlipX(true);
            } else if (this.player.x > enemy.x + 10) {
              enemy.setVelocityX(enemy.chaseSpeed);
              enemy.setFlipX(false);
            }
          } else {
            // Patrol mode
            if (enemy.x <= enemy.patrolLeft) {
              enemy.patrolDirection = 1;
              enemy.setVelocityX(enemy.chaseSpeed * 0.5);
              enemy.setFlipX(false);
            } else if (enemy.x >= enemy.patrolRight) {
              enemy.patrolDirection = -1;
              enemy.setVelocityX(-enemy.chaseSpeed * 0.5);
              enemy.setFlipX(true);
            }
          }
        });

        // Check death
        if (this.player.y > settings.height + 50) {
          this.playerDied();
        }

        // Check level completion
        if (!this.levelCompleting && this.coins && this.coins.children.entries.length === 0) {
          this.levelCompleting = true;
          this.levelComplete();
        }
      }

      collectCoin(player, coin) {
        coin.destroy();
        
        const coinPoints = settings.collectibles && settings.collectibles[0] ? 
          settings.collectibles[0].points : 10;
        
        gameVars.score += coinPoints;
        onScoreUpdate?.(gameVars.score);
        this.updateUI();
        
        // Coin collection effect
        const effect = this.add.text(coin.x, coin.y, `+${coinPoints}`, {
          fontSize: '20px',
          fill: '#FFD700',
          stroke: '#000000',
          strokeThickness: 2
        });
        this.tweens.add({
          targets: effect,
          y: coin.y - 50,
          alpha: 0,
          duration: 1000,
          onComplete: () => effect.destroy()
        });
      }

      hitEnemy(player, enemy) {
        gameVars.lives--;
        
        // Screen shake effect
        this.cameras.main.shake(200, 0.02);
        
        // Reset player position
        this.player.setPosition(100, settings.height - 150);
        this.player.setVelocity(0, 0);
        
        if (gameVars.lives <= 0) {
          this.gameOver();
        } else {
          // Temporary invincibility visual
          this.player.setTint(0xff0000);
          this.time.delayedCall(1000, () => {
            this.player.clearTint();
          });
        }
        
        this.updateUI();
      }

      playerDied() {
        gameVars.lives--;
        this.player.setPosition(100, settings.height - 150);
        this.player.setVelocity(0, 0);
        
        if (gameVars.lives <= 0) {
          this.gameOver();
        }
        this.updateUI();
      }

      levelComplete() {
        gameVars.level++;
        gameVars.score += 50;
        onScoreUpdate?.(gameVars.score);
        
        if (gameVars.level <= (settings.maxLevels || 10)) {
          // Show level complete message
          const levelCompleteContainer = this.add.container(settings.width/2, settings.height/2);
          
          const bg = this.add.rectangle(0, 0, 500, 200, 0x000000, 0.8);
          const levelText = this.add.text(0, -40, `Level ${gameVars.level-1} Complete!`, {
            fontSize: '36px',
            fill: '#00FF00',
            stroke: '#000000',
            strokeThickness: 3
          }).setOrigin(0.5);
          
          const nextLevelText = this.add.text(0, 10, `Starting Level ${gameVars.level}...`, {
            fontSize: '20px',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
          }).setOrigin(0.5);
          
          levelCompleteContainer.add([bg, levelText, nextLevelText]);
          
          this.time.delayedCall(2500, () => {
            levelCompleteContainer.destroy();
            this.setupLevel(gameVars.level);
            this.player.setPosition(100, settings.height - 150);
            this.player.setVelocity(0, 0);
          });
        } else {
          this.gameWon();
        }
      }

      gameOver() {
        gameVars.gameState = 'gameOver';
        onGameOver?.(gameVars.score, gameVars.score);
        this.showGameOverScreen();
      }

      gameWon() {
        gameVars.gameState = 'won';
        onGameOver?.(gameVars.score, gameVars.score);
        this.showWinScreen();
      }

      showGameOverScreen() {
        const gameOverScreen = this.add.container(settings.width/2, settings.height/2);
        
        const bg = this.add.rectangle(0, 0, 600, 350, 0x000000, 0.9);
        const title = this.add.text(0, -100, 'Game Over!', {
          fontSize: '48px',
          fill: '#FF4444',
          stroke: '#000000',
          strokeThickness: 4
        }).setOrigin(0.5);
        
        const levelText = this.add.text(0, -40, `Reached Level: ${gameVars.level}`, {
          fontSize: '20px',
          fill: '#FFFFFF'
        }).setOrigin(0.5);
        
        const scoreText = this.add.text(0, -10, `Final Score: ${gameVars.score}`, {
          fontSize: '24px',
          fill: '#FFFFFF'
        }).setOrigin(0.5);
        
        const restartText = this.add.text(0, 30, 'CLICK to Restart', {
          fontSize: '20px',
          fill: '#FFD700'
        }).setOrigin(0.5);
        
        gameOverScreen.add([bg, title, levelText, scoreText, restartText]);
        
        this.input.once('pointerdown', () => {
          this.restartGame();
        });
      }

      showWinScreen() {
        const winScreen = this.add.container(settings.width/2, settings.height/2);
        
        const bg = this.add.rectangle(0, 0, 600, 350, 0x00AA00, 0.9);
        const title = this.add.text(0, -100, '🎉 VICTORY! 🎉', {
          fontSize: '48px',
          fill: '#FFFFFF',
          stroke: '#000000',
          strokeThickness: 4
        }).setOrigin(0.5);
        
        const completedText = this.add.text(0, -40, `All ${settings.maxLevels || 10} Levels Completed!`, {
          fontSize: '20px',
          fill: '#FFFFFF'
        }).setOrigin(0.5);
        
        const scoreText = this.add.text(0, -10, `Final Score: ${gameVars.score}`, {
          fontSize: '24px',
          fill: '#FFFFFF'
        }).setOrigin(0.5);
        
        const restartText = this.add.text(0, 30, 'CLICK to Play Again', {
          fontSize: '20px',
          fill: '#FFFF00'
        }).setOrigin(0.5);
        
        winScreen.add([bg, title, completedText, scoreText, restartText]);
        
        this.input.once('pointerdown', () => {
          this.restartGame();
        });
      }

      restartGame() {
        gameVars.score = 0;
        gameVars.lives = settings.startingLives || 3;
        gameVars.level = 1;
        gameVars.gameState = 'waiting';
        
        onScoreUpdate?.(0);
        this.scene.restart();
      }

      updateUI() {
        try {
          if (this.scoreText) {
            this.scoreText.setText(`Score: ${gameVars.score}`);
          }
          if (this.livesText) {
            this.livesText.setText(`Lives: ${gameVars.lives}`);
          }
          if (this.levelText) {
            this.levelText.setText(`Level: ${gameVars.level}`);
          }
          if (this.collectText && this.coins) {
            this.collectText.setText(`Collect: ${this.coins.children.entries.length}`);
          }
        } catch (error) {
          console.warn('UI update error:', error);
        }
      }
    }

    // Phaser configuration
    const config = {
      type: Phaser.AUTO,
      width: settings.width,
      height: settings.height,
      parent: gameRef.current,
      backgroundColor: settings.world?.background || settings.backgroundColor,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: PlatformerScene
    };

    try {
      phaserGameRef.current = new Phaser.Game(config);
      console.log('✅ Platformer game created successfully!');
    } catch (error) {
      console.error('❌ Game creation error:', error);
    }

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, [settings, onScoreUpdate, onGameOver]);

  return (
    <div 
      ref={gameRef}
      className="border-2 border-white/20 rounded-lg overflow-hidden"
      style={{ width: `${settings.width}px`, height: `${settings.height}px` }}
    />
  );
};

export default PlatformerGameCore;