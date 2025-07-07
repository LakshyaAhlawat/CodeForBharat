import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useDispatch } from 'react-redux';
import { recordPlay } from '../store/slices/gameSlice';
import { Link } from 'react-router-dom';

const PlatformerGame = () => {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('waiting');
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('platformer-high-score')) || 0;
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (!gameRef.current) return;

    // Clean up previous game
    if (phaserGameRef.current) {
      phaserGameRef.current.destroy(true);
      phaserGameRef.current = null;
    }

    let gameVars = {
      score: 0,
      level: 1,
      lives: 3,
      gameState: 'waiting',
      coinsCollected: 0,
      totalCoins: 0
    };

    class EnhancedPlatformerScene extends Phaser.Scene {
      constructor() {
        super({ key: 'EnhancedPlatformerScene' });
      }

      preload() {
        // Create enhanced sprites
        this.createPlayerSprite();
        this.createPlatformSprite();
        this.createEnemySprite();
        this.createCoinSprite();
        this.createMovingPlatformSprite();
      }

      createPlayerSprite() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0x4CAF50);
        graphics.fillRoundedRect(0, 0, 32, 40, 4);
        
        // Player face
        graphics.fillStyle(0xFFFFFF);
        graphics.fillRoundedRect(4, 4, 24, 20, 2);
        
        // Eyes
        graphics.fillStyle(0x000000);
        graphics.fillCircle(12, 12, 3);
        graphics.fillCircle(20, 12, 3);
        
        // Smile
        graphics.lineStyle(2, 0x000000);
        graphics.arc(16, 16, 6, 0, Math.PI, false);
        graphics.strokePath();
        
        // Body details
        graphics.fillStyle(0x2E7D32);
        graphics.fillRect(8, 24, 16, 12);
        
        graphics.generateTexture('enhanced_player', 32, 40);
        graphics.destroy();
      }

      createPlatformSprite() {
        const graphics = this.add.graphics();
        
        // Main platform
        graphics.fillStyle(0x8D6E63);
        graphics.fillRect(0, 0, 64, 32);
        
        // Grass top
        graphics.fillStyle(0x4CAF50);
        graphics.fillRect(0, 0, 64, 8);
        
        // Add some texture
        graphics.fillStyle(0x6D4C41);
        for (let i = 0; i < 3; i++) {
          graphics.fillRect(i * 20 + 5, 12, 2, 15);
        }
        
        graphics.generateTexture('enhanced_platform', 64, 32);
        graphics.destroy();
      }

      createMovingPlatformSprite() {
        const graphics = this.add.graphics();
        
        // Moving platform (different color)
        graphics.fillStyle(0xFF5722);
        graphics.fillRect(0, 0, 96, 20);
        
        // Top highlight
        graphics.fillStyle(0xFF7043);
        graphics.fillRect(0, 0, 96, 6);
        
        // Side markers
        graphics.fillStyle(0xFFFFFF);
        graphics.fillRect(4, 4, 4, 12);
        graphics.fillRect(88, 4, 4, 12);
        
        graphics.generateTexture('moving_platform', 96, 20);
        graphics.destroy();
      }

      createEnemySprite() {
        const graphics = this.add.graphics();
        
        // Enemy body
        graphics.fillStyle(0xF44336);
        graphics.fillRoundedRect(0, 0, 30, 30, 6);
        
        // Angry eyes
        graphics.fillStyle(0xFFFFFF);
        graphics.fillCircle(8, 10, 4);
        graphics.fillCircle(22, 10, 4);
        
        graphics.fillStyle(0xFF0000);
        graphics.fillCircle(8, 10, 2);
        graphics.fillCircle(22, 10, 2);
        
        // Angry mouth
        graphics.fillStyle(0x000000);
        graphics.fillRect(6, 20, 18, 6);
        graphics.fillStyle(0xFFFFFF);
        for (let i = 0; i < 4; i++) {
          graphics.fillTriangle(8 + i * 4, 20, 10 + i * 4, 26, 12 + i * 4, 20);
        }
        
        graphics.generateTexture('enhanced_enemy', 30, 30);
        graphics.destroy();
      }

      createCoinSprite() {
        const graphics = this.add.graphics();
        
        // Outer ring
        graphics.fillStyle(0xFFD700);
        graphics.fillCircle(12, 12, 12);
        
        // Inner ring
        graphics.fillStyle(0xFFA000);
        graphics.fillCircle(12, 12, 8);
        
        // Star pattern
        graphics.fillStyle(0xFFD700);
        const centerX = 12, centerY = 12;
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4;
          const x = centerX + Math.cos(angle) * 4;
          const y = centerY + Math.sin(angle) * 4;
          graphics.fillCircle(x, y, 1.5);
        }
        
        graphics.generateTexture('enhanced_coin', 24, 24);
        graphics.destroy();
      }

      create() {
        this.physics.world.setBounds(0, 0, 1200, 600);
        
        // Enhanced background
        this.createBackground();
        
        // Create groups
        this.platforms = this.physics.add.staticGroup();
        this.movingPlatforms = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.coins = this.physics.add.group();

        // Enhanced level setup
        this.setupEnhancedLevel();

        // Enhanced player
        this.player = this.physics.add.sprite(100, 450, 'enhanced_player');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(600);
        this.player.setMaxVelocity(300, 1000);

        // Camera follows player
        this.cameras.main.setBounds(0, 0, 1200, 600);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D,SPACE');

        this.createUI();
        this.setupCollisions();
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
      }

      createBackground() {
        // Sky gradient
        this.add.rectangle(600, 300, 1200, 600, 0x87CEEB);
        
        // Clouds
        for (let i = 0; i < 8; i++) {
          const x = i * 150 + 100;
          const y = 80 + (i % 3) * 40;
          this.createCloud(x, y);
        }
        
        // Distant mountains
        const mountains = this.add.graphics();
        mountains.fillStyle(0x8E9AAF, 0.6);
        mountains.fillTriangle(0, 600, 200, 300, 400, 600);
        mountains.fillTriangle(300, 600, 500, 250, 700, 600);
        mountains.fillTriangle(600, 600, 800, 280, 1000, 600);
        mountains.fillTriangle(900, 600, 1100, 320, 1200, 600);
      }

      createCloud(x, y) {
        const cloud = this.add.group();
        
        // Cloud circles
        const c1 = this.add.circle(x, y, 15, 0xFFFFFF, 0.9);
        const c2 = this.add.circle(x + 20, y, 20, 0xFFFFFF, 0.9);
        const c3 = this.add.circle(x + 40, y, 15, 0xFFFFFF, 0.9);
        const c4 = this.add.circle(x + 20, y - 10, 12, 0xFFFFFF, 0.9);
        
        cloud.addMultiple([c1, c2, c3, c4]);
        
        // Animate cloud movement
        this.tweens.add({
          targets: cloud.children.entries,
          x: '+=50',
          duration: 20000,
          repeat: -1,
          ease: 'Linear'
        });
      }

      setupEnhancedLevel() {
        // Ground
        for (let i = 0; i < 19; i++) {
          this.platforms.create(i * 64, 568, 'enhanced_platform');
        }

        // Enhanced platform layout
        const platformData = [
          { x: 300, y: 450, width: 2 },
          { x: 500, y: 350, width: 2 },
          { x: 750, y: 280, width: 3 },
          { x: 1000, y: 200, width: 2 },
          { x: 200, y: 250, width: 1 },
          { x: 600, y: 480, width: 1 },
          { x: 900, y: 400, width: 2 }
        ];

        platformData.forEach(platform => {
          for (let i = 0; i < platform.width; i++) {
            this.platforms.create(platform.x + i * 64, platform.y, 'enhanced_platform');
          }
        });

        // Moving platforms
        this.createMovingPlatform(400, 380, 200, 'horizontal');
        this.createMovingPlatform(800, 320, 100, 'vertical');

        // Enhanced enemies with AI
        this.createSmartEnemy(350, 400, 100, 250);
        this.createSmartEnemy(780, 230, 150, 200);
        this.createSmartEnemy(950, 150, 100, 180);

        // Strategic coin placement
        this.createCoin(320, 400);
        this.createCoin(520, 300);
        this.createCoin(770, 230);
        this.createCoin(1020, 150);
        this.createCoin(220, 200);
        this.createCoin(450, 320); // On moving platform
        this.createCoin(850, 250);
        this.createCoin(1100, 100);

        gameVars.totalCoins = this.coins.children.entries.length;
      }

      createMovingPlatform(x, y, distance, direction) {
        const platform = this.movingPlatforms.create(x, y, 'moving_platform');
        platform.setImmovable(true);
        platform.body.setSize(96, 20);
        
        platform.startX = x;
        platform.startY = y;
        platform.distance = distance;
        platform.direction = direction;
        platform.movingForward = true;

        if (direction === 'horizontal') {
          this.tweens.add({
            targets: platform,
            x: x + distance,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
          });
        } else {
          this.tweens.add({
            targets: platform,
            y: y - distance,
            duration: 2500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
          });
        }
      }

      createSmartEnemy(x, y, patrolDistance, chaseRange) {
        const enemy = this.enemies.create(x, y, 'enhanced_enemy');
        enemy.setBounce(0.2);
        enemy.setGravityY(600);
        enemy.setCollideWorldBounds(true);
        
        // AI properties
        enemy.startX = x;
        enemy.patrolDistance = patrolDistance;
        enemy.chaseRange = chaseRange;
        enemy.baseSpeed = 60 + gameVars.level * 15;
        enemy.chaseSpeed = enemy.baseSpeed * 1.8;
        enemy.patrolDirection = 1;
        enemy.isChasing = false;
        enemy.lastPlayerX = 0;
        enemy.stuckTimer = 0;
        
        enemy.setVelocityX(enemy.baseSpeed);
      }

      createCoin(x, y) {
        const coin = this.coins.create(x, y, 'enhanced_coin');
        
        // Enhanced coin animations
        this.tweens.add({
          targets: coin,
          y: y - 20,
          duration: 2000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
        
        this.tweens.add({
          targets: coin,
          rotation: Math.PI * 2,
          duration: 3000,
          repeat: -1,
          ease: 'Linear'
        });
        
        this.tweens.add({
          targets: coin,
          scaleX: 1.2,
          scaleY: 1.2,
          duration: 1500,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }

      setupCollisions() {
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.movingPlatforms);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.collider(this.enemies, this.movingPlatforms);
        
        this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
      }

      createUI() {
        // Fixed UI that doesn't move with camera
        this.scoreText = this.add.text(20, 20, `Score: ${gameVars.score}`, {
          fontSize: '24px',
          fill: '#FFFFFF',
          stroke: '#000000',
          strokeThickness: 4
        }).setScrollFactor(0);

        this.livesText = this.add.text(20, 50, `Lives: ${gameVars.lives}`, {
          fontSize: '24px',
          fill: '#FFFFFF',
          stroke: '#000000',
          strokeThickness: 4
        }).setScrollFactor(0);

        this.levelText = this.add.text(20, 80, `Level: ${gameVars.level}`, {
          fontSize: '24px',
          fill: '#FFFFFF',
          stroke: '#000000',
          strokeThickness: 4
        }).setScrollFactor(0);

        this.coinText = this.add.text(20, 110, `Coins: ${gameVars.coinsCollected}/${gameVars.totalCoins}`, {
          fontSize: '24px',
          fill: '#FFD700',
          stroke: '#000000',
          strokeThickness: 4
        }).setScrollFactor(0);
      }

      showStartScreen() {
        this.startScreen = this.add.container(400, 300);
        this.startScreen.setScrollFactor(0);
        
        const bg = this.add.rectangle(0, 0, 600, 350, 0x000000, 0.9);
        const title = this.add.text(0, -100, '🏃‍♂️ Enhanced Platform Adventure', {
          fontSize: '28px',
          fill: '#FFFFFF',
          stroke: '#000000',
          strokeThickness: 3
        }).setOrigin(0.5);
        
        const features = this.add.text(0, -40, 
          '✨ Smart AI Enemies • Moving Platforms\n' +
          '🎯 Progressive Difficulty • Enhanced Graphics\n' +
          '🏆 Multiple Levels • Strategic Gameplay', {
          fontSize: '16px',
          fill: '#00FF00',
          align: 'center'
        }).setOrigin(0.5);
        
        const controls = this.add.text(0, 20, 
          '🎮 WASD or Arrow Keys to Move\n' +
          '🦘 SPACE to Jump\n' +
          '💰 Collect ALL coins to advance!', {
          fontSize: '18px',
          fill: '#FFFF00',
          align: 'center'
        }).setOrigin(0.5);
        
        const startText = this.add.text(0, 80, 'CLICK or PRESS SPACE to Start!', {
          fontSize: '24px',
          fill: '#FFD700',
          stroke: '#000000',
          strokeThickness: 2
        }).setOrigin(0.5);
        
        this.startScreen.add([bg, title, features, controls, startText]);
        
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
      }

      update() {
        if (gameVars.gameState !== 'playing') return;

        this.updatePlayer();
        this.updateEnemyAI();
        this.checkLevelCompletion();
        this.checkPlayerDeath();
      }

      updatePlayer() {
        const speed = 200;
        const jumpForce = -450;

        // Player movement
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
          this.player.setVelocityX(-speed);
          this.player.setFlipX(true);
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
          this.player.setVelocityX(speed);
          this.player.setFlipX(false);
        } else {
          this.player.setVelocityX(0);
        }

        // Jumping
        if ((this.cursors.up.isDown || this.wasd.W.isDown || this.wasd.SPACE.isDown) && 
            this.player.body.touching.down) {
          this.player.setVelocityY(jumpForce);
        }
      }

      updateEnemyAI() {
        this.enemies.children.entries.forEach(enemy => {
          if (!enemy.active) return;
          
          const distanceToPlayer = Phaser.Math.Distance.Between(
            enemy.x, enemy.y, this.player.x, this.player.y
          );
          
          // Check if player is in chase range
          if (distanceToPlayer < enemy.chaseRange && Math.abs(enemy.y - this.player.y) < 100) {
            enemy.isChasing = true;
            enemy.lastPlayerX = this.player.x;
            
            // Chase behavior
            if (this.player.x < enemy.x - 15) {
              enemy.setVelocityX(-enemy.chaseSpeed);
              enemy.setFlipX(true);
            } else if (this.player.x > enemy.x + 15) {
              enemy.setVelocityX(enemy.chaseSpeed);
              enemy.setFlipX(false);
            }
            
            // Smart jumping
            if (this.player.y < enemy.y - 50 && enemy.body.touching.down) {
              enemy.setVelocityY(-300);
            }
          } else {
            enemy.isChasing = false;
            
            // Patrol behavior
            const leftBound = enemy.startX - enemy.patrolDistance;
            const rightBound = enemy.startX + enemy.patrolDistance;
            
            if (enemy.x <= leftBound && enemy.patrolDirection === -1) {
              enemy.patrolDirection = 1;
              enemy.setVelocityX(enemy.baseSpeed);
              enemy.setFlipX(false);
            } else if (enemy.x >= rightBound && enemy.patrolDirection === 1) {
              enemy.patrolDirection = -1;
              enemy.setVelocityX(-enemy.baseSpeed);
              enemy.setFlipX(true);
            }
            
            // Handle stuck situations
            if (Math.abs(enemy.body.velocity.x) < 10) {
              enemy.stuckTimer++;
              if (enemy.stuckTimer > 60) { // 1 second at 60fps
                enemy.setVelocityY(-250);
                enemy.stuckTimer = 0;
              }
            } else {
              enemy.stuckTimer = 0;
            }
          }
        });
      }

      checkLevelCompletion() {
        if (gameVars.coinsCollected >= gameVars.totalCoins) {
          this.levelComplete();
        }
      }

      checkPlayerDeath() {
        if (this.player.y > 650) {
          this.playerDied();
        }
      }

      collectCoin(player, coin) {
        // Coin collection effect
        const effect = this.add.text(coin.x, coin.y, '+10', {
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
        
        coin.destroy();
        gameVars.score += 10;
        gameVars.coinsCollected++;
        
        setScore(gameVars.score);
        this.updateUI();
        
        // Screen flash effect
        this.cameras.main.flash(100, 255, 215, 0, false);
      }

      hitEnemy(player, enemy) {
        gameVars.lives--;
        
        // Screen shake effect
        this.cameras.main.shake(300, 0.03);
        
        // Reset player position
        this.player.setPosition(100, 450);
        this.player.setVelocity(0, 0);
        
        if (gameVars.lives <= 0) {
          this.gameOver();
        } else {
          // Temporary invincibility visual
          this.player.setTint(0xff0000);
          this.time.delayedCall(1500, () => {
            this.player.clearTint();
          });
        }
        
        this.updateUI();
      }

      playerDied() {
        gameVars.lives--;
        this.player.setPosition(100, 450);
        this.player.setVelocity(0, 0);
        
        if (gameVars.lives <= 0) {
          this.gameOver();
        }
        this.updateUI();
      }

      levelComplete() {
        gameVars.level++;
        gameVars.score += 100;
        gameVars.coinsCollected = 0;
        
        setScore(gameVars.score);
        
        if (gameVars.level <= 10) {
          this.showLevelCompleteScreen();
        } else {
          this.gameWin();
        }
      }

      showLevelCompleteScreen() {
        const levelCompleteContainer = this.add.container(400, 300);
        levelCompleteContainer.setScrollFactor(0);
        
        const bg = this.add.rectangle(0, 0, 500, 250, 0x000000, 0.9);
        const levelText = this.add.text(0, -60, `🎉 Level ${gameVars.level-1} Complete! 🎉`, {
          fontSize: '32px',
          fill: '#00FF00',
          stroke: '#000000',
          strokeThickness: 3
        }).setOrigin(0.5);
        
        const scoreText = this.add.text(0, -20, `Score: ${gameVars.score}`, {
          fontSize: '24px',
          fill: '#FFFFFF'
        }).setOrigin(0.5);
        
        const nextLevelText = this.add.text(0, 20, `Preparing Level ${gameVars.level}...`, {
          fontSize: '20px',
          fill: '#FFFF00'
        }).setOrigin(0.5);
        
        levelCompleteContainer.add([bg, levelText, scoreText, nextLevelText]);
        
        this.time.delayedCall(3000, () => {
          levelCompleteContainer.destroy();
          this.setupNextLevel();
        });
      }

      setupNextLevel() {
        // Clear existing objects
        this.enemies.clear(true, true);
        this.coins.clear(true, true);
        this.movingPlatforms.clear(true, true);
        
        // Reset player position
        this.player.setPosition(100, 450);
        this.player.setVelocity(0, 0);
        
        // Setup enhanced level with increased difficulty
        this.setupEnhancedLevel();
        this.updateUI();
      }

      gameOver() {
        gameVars.gameState = 'gameOver';
        setGameState('gameOver');
        
        dispatch(recordPlay({ 
          gameType: 'platformer', 
          score: gameVars.score 
        }));
        
        this.showGameOverScreen();
      }

      gameWin() {
        gameVars.gameState = 'won';
        setGameState('won');
        
        dispatch(recordPlay({ 
          gameType: 'platformer', 
          score: gameVars.score 
        }));
        
        this.showWinScreen();
      }

      showGameOverScreen() {
        const gameOverScreen = this.add.container(400, 300);
        gameOverScreen.setScrollFactor(0);
        
        const bg = this.add.rectangle(0, 0, 600, 400, 0x000000, 0.9);
        const title = this.add.text(0, -120, '💀 Game Over! 💀', {
          fontSize: '48px',
          fill: '#FF4444',
          stroke: '#000000',
          strokeThickness: 4
        }).setOrigin(0.5);
        
        const levelText = this.add.text(0, -60, `Reached Level: ${gameVars.level}`, {
          fontSize: '24px',
          fill: '#FFFFFF'
        }).setOrigin(0.5);
        
        const scoreText = this.add.text(0, -30, `Final Score: ${gameVars.score}`, {
          fontSize: '28px',
          fill: '#FFFFFF'
        }).setOrigin(0.5);
        
        const coinsText = this.add.text(0, 0, `Coins Collected: ${gameVars.coinsCollected}`, {
          fontSize: '20px',
          fill: '#FFD700'
        }).setOrigin(0.5);
        
        const restartText = this.add.text(0, 40, 'CLICK to Restart', {
          fontSize: '24px',
          fill: '#FFD700'
        }).setOrigin(0.5);
        
        gameOverScreen.add([bg, title, levelText, scoreText, coinsText, restartText]);
        
        this.input.once('pointerdown', () => {
          this.restartGame();
        });
      }

      showWinScreen() {
        const winScreen = this.add.container(400, 300);
        winScreen.setScrollFactor(0);
        
        const bg = this.add.rectangle(0, 0, 600, 400, 0x00AA00, 0.9);
        const title = this.add.text(0, -120, '🏆 MASTER ACHIEVED! 🏆', {
          fontSize: '40px',
          fill: '#FFFFFF',
          stroke: '#000000',
          strokeThickness: 4
        }).setOrigin(0.5);
        
        const completedText = this.add.text(0, -60, `All 10 Levels Mastered!`, {
          fontSize: '24px',
          fill: '#FFFFFF'
        }).setOrigin(0.5);
        
        const scoreText = this.add.text(0, -30, `Master Score: ${gameVars.score}`, {
          fontSize: '28px',
          fill: '#FFFFFF'
        }).setOrigin(0.5);
        
        const restartText = this.add.text(0, 40, 'CLICK to Play Again', {
          fontSize: '24px',
          fill: '#FFFF00'
        }).setOrigin(0.5);
        
        winScreen.add([bg, title, completedText, scoreText, restartText]);
        
        this.input.once('pointerdown', () => {
          this.restartGame();
        });
      }

      restartGame() {
        gameVars.score = 0;
        gameVars.lives = 3;
        gameVars.level = 1;
        gameVars.coinsCollected = 0;
        gameVars.gameState = 'waiting';
        
        setScore(0);
        setGameState('waiting');
        
        this.scene.restart();
      }

      updateUI() {
        if (this.scoreText) this.scoreText.setText(`Score: ${gameVars.score}`);
        if (this.livesText) this.livesText.setText(`Lives: ${gameVars.lives}`);
        if (this.levelText) this.levelText.setText(`Level: ${gameVars.level}`);
        if (this.coinText) this.coinText.setText(`Coins: ${gameVars.coinsCollected}/${gameVars.totalCoins}`);
      }
    }

    // Phaser configuration
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      backgroundColor: '#87CEEB',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: EnhancedPlatformerScene
    };

    try {
      phaserGameRef.current = new Phaser.Game(config);
    } catch (error) {
      console.error('Game creation error:', error);
    }

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, [dispatch]);

  const updateHighScore = (currentScore) => {
    if (currentScore > highScore) {
      setHighScore(currentScore);
      localStorage.setItem('platformer-high-score', currentScore.toString());
    }
  };

  useEffect(() => {
    updateHighScore(score);
  }, [score, highScore]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link
              to="/"
              className="text-cyan-400 hover:text-cyan-300 mb-2 inline-block"
            >
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🏃‍♂️ Enhanced Platform Adventure
            </h1>
            <p className="text-indigo-200">
              10 Progressive Levels • Smart AI Enemies • Moving Platforms
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-sm text-gray-300">Score</div>
              <div className="text-2xl font-bold text-cyan-400">{score}</div>
            </div>
            
            <div className="bg-yellow-600/30 rounded-lg p-4">
              <div className="text-sm text-gray-300">High Score</div>
              <div className="text-2xl font-bold text-yellow-400">{highScore}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="bg-black/20 rounded-xl p-6 backdrop-blur">
            <div ref={gameRef} className="border-2 border-white/20 rounded-lg overflow-hidden" />
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur inline-block">
            <h3 className="text-lg font-bold mb-2 text-cyan-400">Enhanced Features</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-300">🎮 WASD/Arrow Keys to move</p>
                <p className="text-gray-300">🦘 SPACE to jump</p>
                <p className="text-gray-300">💰 Collect all coins to advance</p>
                <p className="text-gray-300">🏆 10 challenging levels</p>
              </div>
              <div>
                <p className="text-gray-300">👹 Smart AI enemies chase you!</p>
                <p className="text-gray-300">🏗️ Moving platforms included</p>
                <p className="text-gray-300">📈 Progressive difficulty</p>
                <p className="text-gray-300">⚡ Faster enemies each level</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformerGame;