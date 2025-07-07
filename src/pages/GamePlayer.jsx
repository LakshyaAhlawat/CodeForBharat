// src/pages/GamePlayer.jsx - Beautiful visuals and overall high score
import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGame, recordPlay } from '../store/slices/gameSlice';
import { toast } from 'react-hot-toast';
import Phaser from 'phaser';
import PlatformerGame from '../games/PlatformerGame'; // ✅ Add this import
import PlatformerGameCore from '../components/game/PlatformerGameCore';

const GamePlayer = () => {
  const { gameId } = useParams();
  const dispatch = useDispatch();
  const { currentGame, isLoading } = useSelector((state) => state.games);
  
  const [score, setScore] = useState(0);
  const [sessionHighScore, setSessionHighScore] = useState(0);
  const [overallHighScore, setOverallHighScore] = useState(0); // ✅ Overall high score
  const [gameStatus, setGameStatus] = useState('waiting');
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);

  useEffect(() => {
    if (gameId) {
      dispatch(fetchGame(gameId));
      // ✅ Load overall high score from localStorage
      const savedHighScore = localStorage.getItem(`flappy-highscore-${gameId}`);
      if (savedHighScore) {
        setOverallHighScore(parseInt(savedHighScore));
      }
    }
  }, [gameId, dispatch]);

  const handleScoreUpdate = (newScore) => {
    setScore(newScore);
    if (newScore > sessionHighScore) {
      setSessionHighScore(newScore);
    }
    // ✅ Update overall high score
    if (newScore > overallHighScore) {
      setOverallHighScore(newScore);
      localStorage.setItem(`flappy-highscore-${gameId}`, newScore.toString());
      toast.success('🏆 NEW OVERALL HIGH SCORE! 🏆', {
        duration: 3000,
        style: {
          background: '#FFD700',
          color: '#000',
          fontWeight: 'bold'
        }
      });
    }
  };

  const handleGameOver = (finalScore) => {
    setGameStatus('gameOver');
  };

  const handleGameStart = () => {
    setGameStatus('playing');
  };

  // ✅ Beautiful enhanced Phaser game
  useEffect(() => {
    if (gameRef.current && !phaserGameRef.current && currentGame) {
      
      // ✅ Check if this is a platformer game
      if (currentGame.gameComponent === 'PlatformerGame') {
        // Render the platformer game instead of Phaser
        return;
      }
      
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
            debug: false // ✅ Disable debug for clean visuals
          }
        },
        scene: {
          key: 'FlappyScene',
          
          create: function() {
            const scene = this;
            
            // ✅ Game state
            scene.gameActive = false;
            scene.gameStarted = false;
            scene.gameScore = 0;
            scene.pipeSpeed = 200;
            scene.pipeGap = 220; // ✅ Increased from 180 to 220 for easier gameplay
            
            // ✅ Create beautiful gradient background
            const bg = scene.add.graphics();
            bg.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x4682B4, 0x4682B4, 1);
            bg.fillRect(0, 0, 800, 600);
            
            // ✅ Add sun
            const sun = scene.add.circle(700, 100, 60, 0xFFD700, 0.8);
            sun.setStrokeStyle(4, 0xFFA500);
            
            // ✅ Create moving clouds with better animation
            scene.clouds = [];
            scene.cloudContainers = [];
            for (let i = 0; i < 8; i++) {
              const cloudX = Math.random() * 1200;
              const cloudY = Math.random() * 200 + 50;
              const speed = Math.random() * 0.5 + 0.3;
              
              // Create cloud container
              const cloudContainer = scene.add.container(cloudX, cloudY);
              
              // Add multiple circles for fluffy cloud effect
              const cloud1 = scene.add.circle(0, 0, 25, 0xFFFFFF, 0.9);
              const cloud2 = scene.add.circle(20, -5, 20, 0xFFFFFF, 0.9);
              const cloud3 = scene.add.circle(-20, -5, 20, 0xFFFFFF, 0.9);
              const cloud4 = scene.add.circle(10, 10, 15, 0xFFFFFF, 0.9);
              const cloud5 = scene.add.circle(-10, 10, 15, 0xFFFFFF, 0.9);
              
              cloudContainer.add([cloud1, cloud2, cloud3, cloud4, cloud5]);
              scene.clouds.push({ container: cloudContainer, speed });
            }
            
            // ✅ Create ground with grass texture
            const ground = scene.add.rectangle(400, 585, 800, 30, 0x228B22);
            const groundTop = scene.add.rectangle(400, 570, 800, 6, 0x32CD32);
            
            // ✅ Add some trees in background
            for (let i = 0; i < 5; i++) {
              const treeX = Math.random() * 800;
              const trunk = scene.add.rectangle(treeX, 565, 8, 30, 0x8B4513);
              const leaves = scene.add.circle(treeX, 545, 20, 0x228B22, 0.8);
            }
            
            // ✅ Create beautiful bird with detailed features
            scene.birdContainer = scene.add.container(120, 300);
            
            // Bird body with gradient effect
            const birdBody = scene.add.circle(0, 0, 18, 0xFFD700);
            birdBody.setStrokeStyle(2, 0xFFA500);
            
            // Bird wing
            scene.birdWing = scene.add.ellipse(-5, -3, 20, 12, 0xFFA500);
            scene.birdWing.setRotation(-0.2);
            
            // Bird eye
            const eyeWhite = scene.add.circle(8, -5, 6, 0xFFFFFF);
            const eyePupil = scene.add.circle(10, -5, 3, 0x000000);
            const eyeGlint = scene.add.circle(11, -6, 1, 0xFFFFFF);
            
            // Bird beak
            const beak = scene.add.triangle(18, 0, 0, -4, 0, 4, 12, 0, 0xFF6347);
            beak.setStrokeStyle(1, 0xDC143C);
            
            // Add bird parts to container
            scene.birdContainer.add([scene.birdWing, birdBody, eyeWhite, eyePupil, eyeGlint, beak]);
            
            // Add physics to bird container
            scene.physics.add.existing(scene.birdContainer);
            scene.birdContainer.body.setSize(36, 36);
            scene.birdContainer.body.setCollideWorldBounds(false);
            scene.birdContainer.body.setGravityY(0);
            
            // ✅ Create pipes array
            scene.pipeObjects = [];
            
            // ✅ Beautiful UI with shadows and gradients
            scene.scoreText = scene.add.text(50, 50, 'Score: 0', {
              fontSize: '36px',
              fontFamily: 'Arial Black',
              fill: '#FFFFFF',
              stroke: '#000000',
              strokeThickness: 4,
              shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 4, fill: true }
            });
            
            scene.highScoreText = scene.add.text(50, 100, `Best: ${overallHighScore}`, {
              fontSize: '24px',
              fontFamily: 'Arial Black',
              fill: '#FFD700',
              stroke: '#000000',
              strokeThickness: 3,
              shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 4, fill: true }
            });
            
            scene.instructionText = scene.add.text(400, 350, 'Press SPACE or CLICK to Start Flying!', {
              fontSize: '28px',
              fontFamily: 'Arial Black',
              fill: '#FFFFFF',
              stroke: '#000000',
              strokeThickness: 3,
              shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 4, fill: true }
            }).setOrigin(0.5);
            
            // ✅ Floating animation for instruction text
            scene.tweens.add({
              targets: scene.instructionText,
              y: 360,
              duration: 1500,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut'
            });
            
            // ✅ Game Over elements with better styling
            scene.gameOverGroup = scene.add.group();
            
            const gameOverBg = scene.add.rectangle(400, 300, 500, 350, 0x000000, 0.9);
            gameOverBg.setStrokeStyle(4, 0xFFD700);
            
            const gameOverText = scene.add.text(400, 220, 'GAME OVER', {
              fontSize: '48px',
              fontFamily: 'Arial Black',
              fill: '#FF0000',
              stroke: '#FFFFFF',
              strokeThickness: 4,
              shadow: { offsetX: 3, offsetY: 3, color: '#000000', blur: 6, fill: true }
            }).setOrigin(0.5);
            
            scene.finalScoreText = scene.add.text(400, 280, '', {
              fontSize: '28px',
              fontFamily: 'Arial',
              fill: '#FFFFFF',
              stroke: '#000000',
              strokeThickness: 2
            }).setOrigin(0.5);
            
            scene.newRecordText = scene.add.text(400, 320, '', {
              fontSize: '20px',
              fontFamily: 'Arial Black',
              fill: '#FFD700',
              stroke: '#000000',
              strokeThickness: 2
            }).setOrigin(0.5);
            
            scene.overallBestText = scene.add.text(400, 350, '', {
              fontSize: '18px',
              fontFamily: 'Arial',
              fill: '#87CEEB',
              stroke: '#000000',
              strokeThickness: 1
            }).setOrigin(0.5);
            
            const restartText = scene.add.text(400, 390, 'Press SPACE or CLICK to Restart', {
              fontSize: '20px',
              fontFamily: 'Arial',
              fill: '#FFFFFF',
              stroke: '#000000',
              strokeThickness: 2
            }).setOrigin(0.5);
            
            scene.gameOverGroup.addMultiple([
              gameOverBg, gameOverText, scene.finalScoreText, 
              scene.newRecordText, scene.overallBestText, restartText
            ]);
            scene.gameOverGroup.setVisible(false);
            
            // ✅ Enhanced pipe creation with better visuals
            scene.createPipe = function() {
              console.log('🟢 Creating beautiful pipe...');
              
              const pipeX = 900;
              const gapY = Phaser.Math.Between(180, 320); // ✅ Adjusted range for better gap positioning
              
              // ✅ Create TOP pipe with gradient and texture
              const topPipe = scene.add.rectangle(pipeX, gapY - scene.pipeGap/2 - 110, 70, 220, 0x228B22); // ✅ Reduced height slightly
              topPipe.setStrokeStyle(3, 0x1e5f1e);
              scene.physics.add.existing(topPipe, false);
              topPipe.body.setImmovable(true);
              
              // Top pipe cap
              const topCap = scene.add.rectangle(pipeX, gapY - scene.pipeGap/2 + 5, 80, 25, 0x1e5f1e);
              topCap.setStrokeStyle(2, 0x0f3f0f);
              scene.physics.add.existing(topCap, false);
              topCap.body.setImmovable(true);
              
              // ✅ Create BOTTOM pipe with gradient and texture
              const bottomPipe = scene.add.rectangle(pipeX, gapY + scene.pipeGap/2 + 110, 70, 220, 0x228B22); // ✅ Reduced height slightly
              bottomPipe.setStrokeStyle(3, 0x1e5f1e);
              scene.physics.add.existing(bottomPipe, false);
              bottomPipe.body.setImmovable(true);
              
              // Bottom pipe cap
              const bottomCap = scene.add.rectangle(pipeX, gapY + scene.pipeGap/2 - 5, 80, 25, 0x1e5f1e);
              bottomCap.setStrokeStyle(2, 0x0f3f0f);
              scene.physics.add.existing(bottomCap, false);
              bottomCap.body.setImmovable(true);
              
              // ✅ Store pipes for manual movement
              scene.pipeObjects.push({
                top: topPipe,
                topCap: topCap,
                bottom: bottomPipe,
                bottomCap: bottomCap,
                x: pipeX,
                scored: false
              });
              
              // ✅ Add collision detection
              scene.physics.add.overlap(scene.birdContainer, topPipe, scene.gameOver, null, scene);
              scene.physics.add.overlap(scene.birdContainer, topCap, scene.gameOver, null, scene);
              scene.physics.add.overlap(scene.birdContainer, bottomPipe, scene.gameOver, null, scene);
              scene.physics.add.overlap(scene.birdContainer, bottomCap, scene.gameOver, null, scene);
              
              console.log('✅ Beautiful pipe created at x:', pipeX, 'Gap size:', scene.pipeGap);
            };
            
            // ✅ Input handling
            const handleInput = () => {
              if (!scene.gameStarted) {
                console.log('🎮 Starting beautiful game...');
                scene.gameStarted = true;
                scene.gameActive = true;
                scene.instructionText.setVisible(false);
                
                // Stop instruction animation
                scene.tweens.killTweensOf(scene.instructionText);
                
                // Apply bird physics
                scene.birdContainer.body.setGravityY(500);
                scene.birdContainer.body.setVelocityY(-300);
                
                // Wing flap animation
                scene.tweens.add({
                  targets: scene.birdWing,
                  scaleY: 0.7,
                  duration: 100,
                  yoyo: true,
                  ease: 'Power2'
                });
                
                // Create first pipe
                scene.createPipe();
                
                // Start pipe timer
                scene.pipeTimer = scene.time.addEvent({
                  delay: 2500,
                  callback: scene.createPipe,
                  callbackScope: scene,
                  loop: true
                });
                
                handleGameStart();
                
              } else if (scene.gameActive) {
                scene.birdContainer.body.setVelocityY(-300);
                
                // Wing flap animation
                scene.tweens.add({
                  targets: scene.birdWing,
                  scaleY: 0.7,
                  duration: 100,
                  yoyo: true,
                  ease: 'Power2'
                });
                
                console.log('🐦 Bird flapped beautifully!');
              } else {
                scene.restartGame();
              }
            };
            
            // ✅ Event listeners
            scene.input.on('pointerdown', handleInput);
            scene.input.keyboard.on('keydown-SPACE', handleInput);
            
            // ✅ Game functions
            scene.addScore = function() {
              scene.gameScore++;
              scene.scoreText.setText('Score: ' + scene.gameScore);
              handleScoreUpdate(scene.gameScore);
              
              // ✅ Score animation
              scene.tweens.add({
                targets: scene.scoreText,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 150,
                yoyo: true,
                ease: 'Back.easeOut'
              });
              
              console.log('📊 Score increased to:', scene.gameScore);
            };
            
            scene.gameOver = function() {
              console.log('💀 Game Over!');
              scene.gameActive = false;
              
              if (scene.pipeTimer) {
                scene.pipeTimer.destroy();
              }
              
              // ✅ Update game over display with overall high score info
              scene.finalScoreText.setText(`Final Score: ${scene.gameScore}`);
              scene.overallBestText.setText(`Overall Best: ${overallHighScore}`);
              
              if (scene.gameScore === overallHighScore && scene.gameScore > 0) {
                scene.newRecordText.setText('🏆 NEW OVERALL RECORD! 🏆');
                scene.tweens.add({
                  targets: scene.newRecordText,
                  scaleX: 1.1,
                  scaleY: 1.1,
                  duration: 500,
                  yoyo: true,
                  repeat: -1,
                  ease: 'Sine.easeInOut'
                });
              } else if (scene.gameScore === sessionHighScore && scene.gameScore > 0) {
                scene.newRecordText.setText('🌟 Session Best! 🌟');
              } else {
                scene.newRecordText.setText('');
              }
              
              scene.gameOverGroup.setVisible(true);
              handleGameOver(scene.gameScore);
            };
            
            scene.restartGame = function() {
              console.log('🔄 Restarting beautiful game...');
              
              // Reset state
              scene.gameStarted = false;
              scene.gameActive = false;
              scene.gameScore = 0;
              scene.scoreText.setText('Score: 0');
              scene.highScoreText.setText(`Best: ${overallHighScore}`);
              
              // Reset bird
              scene.birdContainer.setPosition(120, 300);
              scene.birdContainer.body.setVelocity(0, 0);
              scene.birdContainer.body.setGravityY(0);
              scene.birdContainer.setRotation(0);
              
              // ✅ Destroy all pipes
              scene.pipeObjects.forEach(pipeSet => {
                if (pipeSet.top) pipeSet.top.destroy();
                if (pipeSet.topCap) pipeSet.topCap.destroy();
                if (pipeSet.bottom) pipeSet.bottom.destroy();
                if (pipeSet.bottomCap) pipeSet.bottomCap.destroy();
              });
              scene.pipeObjects = [];
              
              if (scene.pipeTimer) {
                scene.pipeTimer.destroy();
              }
              
              // Reset UI
              scene.instructionText.setVisible(true);
              // Restart floating animation
              scene.tweens.add({
                targets: scene.instructionText,
                y: 360,
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
              });
              
              scene.gameOverGroup.setVisible(false);
              
              setScore(0);
              setGameStatus('waiting');
            };
          },
          
          update: function() {
            if (this.gameActive && this.gameStarted) {
              // ✅ Move beautiful clouds
              this.clouds.forEach(cloudObj => {
                cloudObj.container.x -= cloudObj.speed;
                if (cloudObj.container.x < -100) {
                  cloudObj.container.x = 900;
                }
              });
              
              // ✅ Manually move pipes and caps
              this.pipeObjects.forEach((pipeSet, index) => {
                const moveSpeed = this.pipeSpeed * (1/60);
                pipeSet.x -= moveSpeed;
                
                pipeSet.top.x = pipeSet.x;
                pipeSet.topCap.x = pipeSet.x;
                pipeSet.bottom.x = pipeSet.x;
                pipeSet.bottomCap.x = pipeSet.x;
                
                // Check scoring
                if (!pipeSet.scored && pipeSet.x < this.birdContainer.x - 50) {
                  pipeSet.scored = true;
                  this.addScore();
                }
                
                // Remove off-screen pipes
                if (pipeSet.x < -100) {
                  console.log('🗑️ Removing off-screen beautiful pipe pair');
                  pipeSet.top.destroy();
                  pipeSet.topCap.destroy();
                  pipeSet.bottom.destroy();
                  pipeSet.bottomCap.destroy();
                  this.pipeObjects.splice(index, 1);
                }
              });
              
              // ✅ Check bird boundaries
              if (this.birdContainer.y > 570 || this.birdContainer.y < 30) {
                this.gameOver();
              }
              
              // ✅ Beautiful bird rotation and wing animation
              const velocity = this.birdContainer.body.velocity.y;
              if (velocity < 0) {
                this.birdContainer.setRotation(-0.3);
                this.birdWing.setRotation(-0.5);
              } else {
                this.birdContainer.setRotation(Math.min(0.8, velocity * 0.003));
                this.birdWing.setRotation(-0.2 + Math.min(0.3, velocity * 0.002));
              }
            } else {
              // ✅ Move clouds slowly even when game not started
              this.clouds.forEach(cloudObj => {
                cloudObj.container.x -= cloudObj.speed * 0.3;
                if (cloudObj.container.x < -100) {
                  cloudObj.container.x = 900;
                }
              });
            }
          }
        }
      };

      try {
        phaserGameRef.current = new Phaser.Game(config);
        console.log('✅ Beautiful Phaser game created');
      } catch (error) {
        console.error('❌ Failed to create Phaser game:', error);
        toast.error('Failed to load game');
      }
    }

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, [currentGame, overallHighScore]);

  const renderGameScene = () => {
    if (!currentGame) return null;

    // Determine game type
    const gameType = currentGame.type || currentGame.template || currentGame.phaserConfig?.type;
    
    if (gameType === 'platformer') {
      // Render platformer game
      return createPlatformerScene();
    } else {
      // Render flappy bird game (your existing code)
      return createFlappyScene();
    }
  };

  const createPlatformerScene = () => {
    return {
      key: 'PlatformerGameScene',
      
      preload: function() {
        console.log('🎮 Loading Platformer Game...');
        
        // Create player sprite
        const playerGraphics = this.add.graphics();
        playerGraphics.fillStyle(0x4CAF50);
        playerGraphics.fillRect(0, 0, 32, 40);
        playerGraphics.fillStyle(0xFFFFFF);
        playerGraphics.fillRect(6, 6, 20, 14);
        playerGraphics.fillStyle(0x000000);
        playerGraphics.fillCircle(12, 12, 3);
        playerGraphics.fillCircle(20, 12, 3);
        playerGraphics.generateTexture('player', 32, 40);
        playerGraphics.destroy();

        // Create platform sprite
        const platformGraphics = this.add.graphics();
        platformGraphics.fillStyle(0x228B22);
        platformGraphics.fillRect(0, 0, 64, 32);
        platformGraphics.generateTexture('platform', 64, 32);
        platformGraphics.destroy();

        // Create enemy sprite
        const enemyGraphics = this.add.graphics();
        enemyGraphics.fillStyle(0xFF4444);
        enemyGraphics.fillRect(0, 0, 30, 30);
        enemyGraphics.generateTexture('enemy', 30, 30);
        enemyGraphics.destroy();

        // Create coin sprite
        const coinGraphics = this.add.graphics();
        coinGraphics.fillStyle(0xFFD700);
        coinGraphics.fillCircle(12, 12, 12);
        coinGraphics.generateTexture('coin', 24, 24);
        coinGraphics.destroy();
      },
      
      create: function() {
        console.log('🏗️ Creating Platformer World...');
        
        // Get game config
        const config = currentGame.phaserConfig || currentGame.defaultConfig || {};
        
        // Background
        const bgColor = config.world?.background ? 
          parseInt(config.world.background.replace('#', '0x')) : 0x87CEEB;
        this.add.rectangle(400, 300, 800, 600, bgColor);

        // Physics groups
        this.platforms = this.physics.add.staticGroup();
        this.enemies = this.physics.add.group();
        this.coins = this.physics.add.group();

        // Create ground
        const ground = this.platforms.create(400, 568, 'platform');
        ground.setScale(13, 1).refreshBody();

        // Create platforms from config or default
        if (config.world?.platforms) {
          config.world.platforms.forEach(platform => {
            if (platform.x !== 0 || platform.y !== 568) { // Skip ground platform
              const p = this.platforms.create(
                platform.x + platform.width/2, 
                platform.y + platform.height/2, 
                'platform'
              );
              p.setScale(platform.width/64, platform.height/32).refreshBody();
            }
          });
        } else {
          // Default platforms
          this.platforms.create(200, 450, 'platform').setScale(3, 1).refreshBody();
          this.platforms.create(600, 350, 'platform').setScale(2, 1).refreshBody();
        }

        // Player
        this.player = this.physics.add.sprite(100, 450, 'player');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(config.world?.gravity || 600);

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D,SPACE');

        // Create enemies from config
        if (config.enemies) {
          config.enemies.forEach(enemyConfig => {
            const enemy = this.enemies.create(
              enemyConfig.x || 300, 
              enemyConfig.y || 520, 
              'enemy'
            );
            enemy.setBounce(0.3);
            enemy.setGravityY(config.world?.gravity || 600);
            enemy.setVelocity(enemyConfig.speed || 50, 0);
            enemy.setCollideWorldBounds(true);
          });
        }

        // Create coins from config
        if (config.collectibles) {
          config.collectibles.forEach(coin => {
            this.coins.create(coin.x || 250, coin.y || 400, 'coin');
          });
        } else {
          // Default coins
          this.coins.create(250, 400, 'coin');
          this.coins.create(650, 300, 'coin');
        }

        // Collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

        // UI
        this.scoreText = this.add.text(16, 16, `Score: ${score}`, {
          fontSize: '32px',
          fill: '#000'
        });

        this.coinsText = this.add.text(16, 56, `Coins: 0/${this.coins.children.entries.length}`, {
          fontSize: '24px',
          fill: '#FFD700'
        });

        // Game state
        this.gameActive = true;
        this.coinsCollected = 0;
        this.totalCoins = this.coins.children.entries.length;

        // Start message
        this.add.text(400, 100, 'Platform Adventure!', {
          fontSize: '32px',
          fill: '#FFFFFF',
          stroke: '#000000',
          strokeThickness: 4
        }).setOrigin(0.5);

        this.add.text(400, 140, 'Collect all coins to win!', {
          fontSize: '20px',
          fill: '#FFFF00',
          stroke: '#000000',
          strokeThickness: 2
        }).setOrigin(0.5);
      },
      
      update: function() {
        if (!this.gameActive) return;

        const config = currentGame.phaserConfig || currentGame.defaultConfig || {};
        const playerSpeed = config.player?.speed || 160;
        const jumpHeight = Math.abs(config.player?.jumpHeight || 400);

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

        if ((this.cursors.up.isDown || this.wasd.SPACE.isDown) && this.player.body.touching.down) {
          this.player.setVelocityY(-jumpHeight);
        }

        // Enemy movement
        this.enemies.children.entries.forEach(enemy => {
          if (enemy.body.velocity.x === 0) {
            enemy.setVelocityX(enemy.body.velocity.x > 0 ? -50 : 50);
          }
          if (enemy.body.blocked.left || enemy.body.blocked.right) {
            enemy.setVelocityX(-enemy.body.velocity.x);
          }
        });

        // Check death
        if (this.player.y > 600) {
          this.gameOver();
        }

        // Check win condition
        if (this.coinsCollected >= this.totalCoins) {
          this.gameWin();
        }
      },

      collectCoin: function(player, coin) {
        coin.destroy();
        this.coinsCollected++;
        
        // Update score
        const newScore = score + 10;
        setScore(newScore);
        onScoreUpdate(newScore);
        
        // Update UI
        this.scoreText.setText(`Score: ${newScore}`);
        this.coinsText.setText(`Coins: ${this.coinsCollected}/${this.totalCoins}`);
        
        // Coin effect
        const effect = this.add.text(coin.x, coin.y, '+10', {
          fontSize: '20px',
          fill: '#FFD700'
        });
        this.tweens.add({
          targets: effect,
          y: coin.y - 50,
          alpha: 0,
          duration: 1000,
          onComplete: () => effect.destroy()
        });
      },

      hitEnemy: function(player, enemy) {
        this.gameOver();
      },

      gameOver: function() {
        this.gameActive = false;
        this.add.text(400, 300, 'Game Over!', {
          fontSize: '48px',
          fill: '#FF0000',
          stroke: '#000000',
          strokeThickness: 4
        }).setOrigin(0.5);
        
        onGameOver(score, overallHighScore);
      },

      gameWin: function() {
        this.gameActive = false;
        this.add.text(400, 300, '🎉 Victory! 🎉', {
          fontSize: '48px',
          fill: '#00FF00',
          stroke: '#000000',
          strokeThickness: 4
        }).setOrigin(0.5);
        
        this.add.text(400, 350, 'All coins collected!', {
          fontSize: '24px',
          fill: '#FFFFFF',
          stroke: '#000000',
          strokeThickness: 2
        }).setOrigin(0.5);
        
        onGameOver(score, overallHighScore);
      }
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">Loading Game...</h2>
        </div>
      </div>
    );
  }

  if (!currentGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Game Not Found</h2>
          <Link
            to="/games"
            className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-lg font-semibold transition"
          >
            Browse Games
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link
              to="/games"
              className="text-cyan-400 hover:text-cyan-300 mb-2 inline-block"
            >
              ← Back to Games
            </Link>
            <h1 className="text-3xl font-bold">{currentGame.title}</h1>
            <p className="text-indigo-200">{currentGame.description}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-sm text-gray-300">Score</div>
              <div className="text-2xl font-bold text-cyan-400">{score}</div>
            </div>
            
            <div className="bg-yellow-600/30 rounded-lg p-4">
              <div className="text-sm text-gray-300">Session Best</div>
              <div className="text-2xl font-bold text-yellow-400">{sessionHighScore}</div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-4">
              <div className="text-sm text-black font-bold">🏆 Overall Best</div>
              <div className="text-2xl font-bold text-black">{overallHighScore}</div>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex justify-center">
          <div className="bg-black/20 rounded-xl p-6 backdrop-blur">
            {currentGame.gameComponent === 'PlatformerGame' ? (
              // ✅ Render Platformer Game
              <PlatformerGame
                gameConfig={currentGame.config}
                gameId={gameId}
                onScoreUpdate={handleScoreUpdate}
                onGameOver={handleGameOver}
              />
            ) : (
              // ✅ Render Phaser games (Flappy Bird, etc.)
              <div 
                ref={gameRef} 
                style={{ width: 800, height: 600 }}
                className="border-2 border-white/20 rounded-lg overflow-hidden shadow-2xl"
              />
            )}
          </div>
        </div>

        {/* Game Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur text-center">
            <h4 className="text-cyan-400 font-bold">Current Score</h4>
            <p className="text-2xl font-bold">{score}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur text-center">
            <h4 className="text-yellow-400 font-bold">Session High</h4>
            <p className="text-2xl font-bold">{sessionHighScore}</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-xl p-4 backdrop-blur text-center border border-yellow-400/30">
            <h4 className="text-yellow-400 font-bold">🏆 Overall Best</h4>
            <p className="text-2xl font-bold text-yellow-300">{overallHighScore}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur text-center">
            <h4 className="text-green-400 font-bold">Status</h4>
            <p className="text-lg font-bold capitalize">{gameStatus}</p>
          </div>
        </div>

        {/* Controls Info */}
        <div className="mt-8 text-center">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur inline-block">
            <h3 className="text-lg font-bold mb-2 text-cyan-400">How to Play</h3>
            <p className="text-gray-300">
              🎮 Press <strong>SPACE</strong> or <strong>Click</strong> to make the bird fly up
            </p>
            <p className="text-gray-300 text-sm mt-1">
              🎯 Navigate through the pipe gaps to score points and beat the overall record!
            </p>
            <p className="text-gray-300 text-sm">
              🏆 Overall best score is saved permanently across all sessions!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePlayer;