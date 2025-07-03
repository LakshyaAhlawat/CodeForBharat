// Create a new file: src/pages/GamePlayer.jsx
import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGame, recordPlay, toggleLike } from '../store/slices/gameSlice';
import { toast } from 'react-hot-toast';
import Phaser from 'phaser';

const GamePlayer = () => {
  const { gameId } = useParams();
  const dispatch = useDispatch();
  const { currentGame, isLoading } = useSelector((state) => state.games);
  const { user } = useSelector((state) => state.auth);
  
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('menu');
  const [highScore, setHighScore] = useState(0);
  const [sessionHighScore, setSessionHighScore] = useState(0);
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);

  useEffect(() => {
    if (gameId) {
      dispatch(fetchGame(gameId));
    }
  }, [dispatch, gameId]);

  useEffect(() => {
    if (currentGame && gameStarted) {
      dispatch(recordPlay(gameId));
    }
  }, [dispatch, gameId, currentGame, gameStarted]);

  useEffect(() => {
    const savedHighScore = localStorage.getItem(`highScore_${gameId}`);
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, [gameId]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem(`highScore_${gameId}`, score.toString());
    }
    if (score > sessionHighScore) {
      setSessionHighScore(score);
    }
  }, [score, highScore, sessionHighScore, gameId]);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like games');
      return;
    }
    
    try {
      await dispatch(toggleLike(gameId));
      toast.success('Thanks for your feedback!');
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setGameState('playing');
    setScore(0);
    initializePhaserGame();
  };

  const pauseGame = () => {
    setGameState('paused');
    if (phaserGameRef.current?.scene?.scenes[0]) {
      phaserGameRef.current.scene.scenes[0].scene.pause();
    }
  };

  const resumeGame = () => {
    setGameState('playing');
    if (phaserGameRef.current?.scene?.scenes[0]) {
      phaserGameRef.current.scene.scenes[0].scene.resume();
    }
  };

  const endGame = () => {
    setGameState('gameOver');
    if (phaserGameRef.current?.scene?.scenes[0]) {
      phaserGameRef.current.scene.scenes[0].scene.pause();
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameState('menu');
    setScore(0);
    if (phaserGameRef.current) {
      phaserGameRef.current.destroy(true);
      phaserGameRef.current = null;
    }
  };

  const initializePhaserGame = () => {
    if (!currentGame || !gameRef.current) return;

    if (phaserGameRef.current) {
      phaserGameRef.current.destroy(true);
      phaserGameRef.current = null;
    }

    const gameData = currentGame.gameData || currentGame.phaserConfig || {};
    const gameType = gameData.type || currentGame.type || 'platformer';

    const config = {
      type: Phaser.AUTO,
      width: gameData.width || 800,
      height: gameData.height || 600,
      parent: gameRef.current,
      backgroundColor: gameData.world?.background || '#87CEEB',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: gameData.world?.gravity || 300 },
          debug: false
        }
      },
      scene: createGameScene(gameType, gameData)
    };

    try {
      phaserGameRef.current = new Phaser.Game(config);
    } catch (error) {
      console.error('Failed to initialize Phaser game:', error);
    }
  };

  const createGameScene = (gameType, gameData) => {
    const updateScore = (newScore) => {
      setScore(newScore);
    };

    const gameOver = () => {
      endGame();
    };

    switch (gameType) {
      case 'flappy':
        return createFlappyScene(gameData, updateScore, gameOver);
      case 'platformer':
        return createPlatformerScene(gameData, updateScore, gameOver);
      case 'runner':
        return createRunnerScene(gameData, updateScore, gameOver);
      case 'shooter':
        return createShooterScene(gameData, updateScore, gameOver);
      default:
        return createPlatformerScene(gameData, updateScore, gameOver);
    }
  };

  // Fixed Flappy Bird Scene with proper collision detection
  const createFlappyScene = (gameData, updateScore, gameOver) => {
    return {
      key: 'GameScene',
      
      preload: function() {
        // Create bird sprite
        this.load.image('bird', 'data:image/svg+xml;base64,' + btoa(`
          <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="${gameData.player?.color || '#FFD700'}" stroke="#000" stroke-width="2"/>
            <circle cx="12" cy="12" r="2" fill="#000"/>
            <polygon points="28,16 34,12 34,20" fill="#FFA500"/>
          </svg>
        `));
        
        // Create pipe sprite
        this.load.image('pipe', 'data:image/svg+xml;base64,' + btoa(`
          <svg width="64" height="400" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="400" fill="#228B22" stroke="#000" stroke-width="2"/>
            <rect x="4" y="0" width="56" height="20" fill="#32CD32"/>
            <rect x="4" y="380" width="56" height="20" fill="#32CD32"/>
          </svg>
        `));
      },
      
      create: function() {
        const scene = this;
        
        // Create bird
        scene.bird = scene.physics.add.sprite(100, 300, 'bird');
        scene.bird.setCollideWorldBounds(false); // Allow bird to go off screen to trigger game over
        scene.bird.body.setSize(28, 28); // Set collision body size
        scene.bird.setGravityY(400);
        
        // Create pipe groups
        scene.pipes = scene.physics.add.group();
        scene.scoreTriggers = scene.physics.add.group();
        
        // Game variables
        scene.gameActive = true;
        scene.gameScore = 0;
        scene.pipeGap = 150;
        scene.pipeSpeed = 200;
        scene.difficultyTimer = 0;
        
        // Score display
        scene.scoreText = scene.add.text(16, 16, 'Score: 0', {
          fontSize: '32px',
          fill: '#000',
          stroke: '#fff',
          strokeThickness: 2
        });
        
        // Instructions
        scene.instructionText = scene.add.text(400, 100, 'TAP SPACE or CLICK to FLY', {
          fontSize: '24px',
          fill: '#000',
          stroke: '#fff',
          strokeThickness: 2
        }).setOrigin(0.5);
        
        // Spawn pipes function
        scene.spawnPipe = () => {
          if (!scene.gameActive) return;
          
          const pipeY = Phaser.Math.Between(150, 350);
          
          // Top pipe
          const topPipe = scene.pipes.create(850, pipeY - 200, 'pipe');
          topPipe.setOrigin(0, 1);
          topPipe.body.setSize(64, 400);
          topPipe.body.setImmovable(true);
          topPipe.setVelocityX(-scene.pipeSpeed);
          
          // Bottom pipe
          const bottomPipe = scene.pipes.create(850, pipeY + scene.pipeGap, 'pipe');
          bottomPipe.setOrigin(0, 0);
          bottomPipe.body.setSize(64, 400);
          bottomPipe.body.setImmovable(true);
          bottomPipe.setVelocityX(-scene.pipeSpeed);
          
          // Score trigger (invisible)
          const trigger = scene.scoreTriggers.create(850, pipeY + scene.pipeGap/2, null);
          trigger.setSize(10, scene.pipeGap);
          trigger.setVisible(false);
          trigger.scored = false;
          trigger.setVelocityX(-scene.pipeSpeed);
        };
        
        // Spawn pipes timer
        scene.pipeTimer = scene.time.addEvent({
          delay: 2000,
          callback: scene.spawnPipe,
          loop: true
        });
        
        // Spawn first pipe
        scene.time.delayedCall(2000, scene.spawnPipe);
        
        // Collisions with pipes
        scene.physics.add.collider(scene.bird, scene.pipes, () => {
          if (scene.gameActive) {
            scene.gameActive = false;
            scene.bird.setTint(0xff0000);
            scene.pipeTimer.remove();
            scene.time.delayedCall(1000, () => {
              gameOver();
            });
          }
        });
        
        // Score detection
        scene.physics.add.overlap(scene.bird, scene.scoreTriggers, (bird, trigger) => {
          if (!trigger.scored && scene.gameActive) {
            trigger.scored = true;
            scene.gameScore += 1;
            scene.scoreText.setText('Score: ' + scene.gameScore);
            updateScore(scene.gameScore);
            
            // Hide instruction after first score
            if (scene.gameScore === 1) {
              scene.instructionText.setVisible(false);
            }
          }
        });
        
        // Controls
        scene.input.keyboard.on('keydown-SPACE', () => {
          if (scene.gameActive) {
            scene.bird.setVelocityY(-350);
            scene.bird.setRotation(-0.3);
          }
        });
        
        scene.input.on('pointerdown', () => {
          if (scene.gameActive) {
            scene.bird.setVelocityY(-350);
            scene.bird.setRotation(-0.3);
          }
        });
      },
      
      update: function() {
        const scene = this;
        
        if (!scene.gameActive) return;
        
        // Bird rotation based on velocity
        if (scene.bird.body.velocity.y > 0) {
          scene.bird.setRotation(0.3);
        }
        
        // Check if bird hits ground or ceiling
        if (scene.bird.y > 600 || scene.bird.y < 0) {
          scene.gameActive = false;
          scene.pipeTimer.remove();
          gameOver();
        }
        
        // Increase difficulty over time
        scene.difficultyTimer += scene.game.loop.delta;
        if (scene.difficultyTimer > 15000) { // Every 15 seconds
          scene.pipeSpeed += 10;
          scene.difficultyTimer = 0;
        }
        
        // Clean up off-screen objects
        scene.pipes.children.entries.forEach(pipe => {
          if (pipe.x < -100) {
            pipe.destroy();
          }
        });
        
        scene.scoreTriggers.children.entries.forEach(trigger => {
          if (trigger.x < -100) {
            trigger.destroy();
          }
        });
      }
    };
  };

  // Fixed Platformer Scene
  const createPlatformerScene = (gameData, updateScore, gameOver) => {
    return {
      key: 'GameScene',
      
      preload: function() {
        this.load.image('player', 'data:image/svg+xml;base64,' + btoa(`
          <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" fill="${gameData.player?.color || '#00ff00'}" stroke="#000" stroke-width="2"/>
            <circle cx="8" cy="8" r="2" fill="#000"/>
            <circle cx="24" cy="8" r="2" fill="#000"/>
            <rect x="8" y="20" width="16" height="4" fill="#000"/>
          </svg>
        `));
        
        this.load.image('platform', 'data:image/svg+xml;base64,' + btoa(`
          <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" fill="#8B4513" stroke="#000" stroke-width="1"/>
          </svg>
        `));
        
        this.load.image('coin', 'data:image/svg+xml;base64,' + btoa(`
          <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="8" fill="#FFD700" stroke="#000" stroke-width="2"/>
            <text x="10" y="14" font-family="Arial" font-size="12" fill="#000" text-anchor="middle">$</text>
          </svg>
        `));
      },
      
      create: function() {
        const scene = this;
        
        // Create platforms
        scene.platforms = scene.physics.add.staticGroup();
        
        // Ground
        scene.platforms.create(400, 568, 'platform').setScale(800/32, 1).refreshBody();
        
        // Moving platforms
        scene.platforms.create(600, 400, 'platform').setScale(200/32, 1).refreshBody();
        scene.platforms.create(50, 250, 'platform').setScale(200/32, 1).refreshBody();
        scene.platforms.create(750, 220, 'platform').setScale(200/32, 1).refreshBody();
        
        // Create player
        scene.player = scene.physics.add.sprite(100, 450, 'player');
        scene.player.setBounce(0.2);
        scene.player.setCollideWorldBounds(true);
        scene.player.body.setSize(28, 28);
        scene.physics.add.collider(scene.player, scene.platforms);
        
        // Create coins group
        scene.coins = scene.physics.add.group();
        
        // Game variables
        scene.gameActive = true;
        scene.gameScore = 0;
        scene.level = 1;
        scene.coinsCollected = 0;
        scene.totalCoins = 0;
        
        // Score display
        scene.scoreText = scene.add.text(16, 16, 'Score: 0', {
          fontSize: '32px',
          fill: '#000',
          stroke: '#fff',
          strokeThickness: 2
        });
        
        scene.levelText = scene.add.text(16, 56, 'Level: 1', {
          fontSize: '24px',
          fill: '#000',
          stroke: '#fff',
          strokeThickness: 2
        });
        
        // Spawn coins function
        scene.spawnCoins = () => {
          const coinCount = 4 + scene.level;
          
          for (let i = 0; i < coinCount; i++) {
            const x = Phaser.Math.Between(50, 750);
            const y = Phaser.Math.Between(100, 400);
            const coin = scene.coins.create(x, y, 'coin');
            coin.setBounce(0.4);
            coin.setCollideWorldBounds(true);
            coin.body.setSize(16, 16);
            scene.physics.add.collider(coin, scene.platforms);
          }
          
          scene.totalCoins = coinCount;
          scene.coinsCollected = 0;
        };
        
        scene.spawnCoins();
        
        // Player-coin collision
        scene.physics.add.overlap(scene.player, scene.coins, (player, coin) => {
          if (scene.gameActive) {
            coin.destroy();
            scene.coinsCollected++;
            scene.gameScore += 10 * scene.level;
            scene.scoreText.setText('Score: ' + scene.gameScore);
            updateScore(scene.gameScore);
            
            // Level up when all coins collected
            if (scene.coinsCollected >= scene.totalCoins) {
              scene.level++;
              scene.levelText.setText('Level: ' + scene.level);
              
              // Spawn new coins
              scene.time.delayedCall(1000, () => {
                scene.spawnCoins();
              });
              
              // Show level up message
              const levelUpText = scene.add.text(400, 300, 'LEVEL UP!', {
                fontSize: '48px',
                fill: '#00ff00',
                stroke: '#000',
                strokeThickness: 3
              }).setOrigin(0.5);
              
              scene.time.delayedCall(2000, () => {
                levelUpText.destroy();
              });
            }
          }
        });
        
        // Controls
        scene.cursors = scene.input.keyboard.createCursorKeys();
        scene.wasd = scene.input.keyboard.addKeys('W,S,A,D');
      },
      
      update: function() {
        const scene = this;
        
        if (!scene.gameActive) return;
        
        // Player movement
        if (scene.cursors.left.isDown || scene.wasd.A.isDown) {
          scene.player.setVelocityX(-160);
        } else if (scene.cursors.right.isDown || scene.wasd.D.isDown) {
          scene.player.setVelocityX(160);
        } else {
          scene.player.setVelocityX(0);
        }
        
        // Jumping
        if ((scene.cursors.up.isDown || scene.wasd.W.isDown) && scene.player.body.touching.down) {
          scene.player.setVelocityY(-500);
        }
        
        // Check if player falls off
        if (scene.player.y > 650) {
          scene.gameActive = false;
          gameOver();
        }
      }
    };
  };

  // Fixed Runner Scene
  const createRunnerScene = (gameData, updateScore, gameOver) => {
    return {
      key: 'GameScene',
      
      preload: function() {
        this.load.image('player', 'data:image/svg+xml;base64,' + btoa(`
          <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" fill="${gameData.player?.color || '#ff6b6b'}" stroke="#000" stroke-width="2"/>
            <circle cx="8" cy="8" r="2" fill="#000"/>
            <circle cx="24" cy="8" r="2" fill="#000"/>
          </svg>
        `));
        
        this.load.image('obstacle', 'data:image/svg+xml;base64,' + btoa(`
          <svg width="32" height="64" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="64" fill="#FF0000" stroke="#000" stroke-width="2"/>
          </svg>
        `));
        
        this.load.image('ground', 'data:image/svg+xml;base64,' + btoa(`
          <svg width="800" height="40" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="40" fill="#8B4513"/>
          </svg>
        `));
        
        this.load.image('coin', 'data:image/svg+xml;base64,' + btoa(`
          <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="8" fill="#FFD700" stroke="#000" stroke-width="2"/>
            <text x="10" y="14" font-family="Arial" font-size="12" fill="#000" text-anchor="middle">$</text>
          </svg>
        `));
      },
      
      create: function() {
        const scene = this;
        
        // Create ground
        scene.ground = scene.physics.add.staticGroup();
        scene.ground.create(400, 580, 'ground').setScale(1, 1).refreshBody();
        
        // Create player
        scene.player = scene.physics.add.sprite(100, 516, 'player');
        scene.player.setCollideWorldBounds(true);
        scene.player.body.setSize(28, 28);
        scene.physics.add.collider(scene.player, scene.ground);
        
        // Create groups
        scene.obstacles = scene.physics.add.group();
        scene.coins = scene.physics.add.group();
        
        // Game variables
        scene.gameActive = true;
        scene.gameScore = 0;
        scene.gameSpeed = 200;
        scene.distance = 0;
        
        // Score display
        scene.scoreText = scene.add.text(16, 16, 'Score: 0', {
          fontSize: '32px',
          fill: '#000',
          stroke: '#fff',
          strokeThickness: 2
        });
        
        scene.distanceText = scene.add.text(16, 56, 'Distance: 0m', {
          fontSize: '24px',
          fill: '#000',
          stroke: '#fff',
          strokeThickness: 2
        });
        
        // Spawn obstacles
        scene.obstacleTimer = scene.time.addEvent({
          delay: 2000,
          callback: () => {
            if (!scene.gameActive) return;
            
            const obstacle = scene.obstacles.create(850, 516, 'obstacle');
            obstacle.body.setSize(28, 60);
            obstacle.body.setImmovable(true);
            obstacle.setVelocityX(-scene.gameSpeed);
          },
          loop: true
        });
        
        // Spawn coins
        scene.coinTimer = scene.time.addEvent({
          delay: 3000,
          callback: () => {
            if (!scene.gameActive) return;
            
            const coin = scene.coins.create(850, Phaser.Math.Between(400, 500), 'coin');
            coin.body.setSize(16, 16);
            coin.setVelocityX(-scene.gameSpeed);
          },
          loop: true
        });
        
        // Collisions
        scene.physics.add.collider(scene.player, scene.obstacles, () => {
          if (scene.gameActive) {
            scene.gameActive = false;
            scene.player.setTint(0xff0000);
            scene.obstacleTimer.remove();
            scene.coinTimer.remove();
            scene.time.delayedCall(1000, () => {
              gameOver();
            });
          }
        });
        
        scene.physics.add.overlap(scene.player, scene.coins, (player, coin) => {
          if (scene.gameActive) {
            coin.destroy();
            scene.gameScore += 50;
            scene.scoreText.setText('Score: ' + scene.gameScore);
            updateScore(scene.gameScore);
          }
        });
        
        // Controls
        scene.input.keyboard.on('keydown-SPACE', () => {
          if (scene.gameActive && scene.player.body.touching.down) {
            scene.player.setVelocityY(-400);
          }
        });
        
        scene.input.on('pointerdown', () => {
          if (scene.gameActive && scene.player.body.touching.down) {
            scene.player.setVelocityY(-400);
          }
        });
      },
      
      update: function() {
        const scene = this;
        
        if (!scene.gameActive) return;
        
        // Update distance and score
        scene.distance += 1;
        scene.gameScore += 1;
        
        if (scene.gameScore % 100 === 0) {
          scene.gameSpeed += 10;
          scene.distanceText.setText('Distance: ' + Math.floor(scene.distance / 10) + 'm');
          scene.scoreText.setText('Score: ' + scene.gameScore);
          updateScore(scene.gameScore);
        }
        
        // Clean up off-screen objects
        scene.obstacles.children.entries.forEach(obstacle => {
          if (obstacle.x < -50) {
            obstacle.destroy();
          }
        });
        
        scene.coins.children.entries.forEach(coin => {
          if (coin.x < -50) {
            coin.destroy();
          }
        });
      }
    };
  };

  // Fixed Shooter Scene
  const createShooterScene = (gameData, updateScore, gameOver) => {
    return {
      key: 'GameScene',
      
      preload: function() {
        this.load.image('player', 'data:image/svg+xml;base64,' + btoa(`
          <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
            <polygon points="16,0 8,32 24,32" fill="${gameData.player?.color || '#00FFFF'}" stroke="#000" stroke-width="2"/>
          </svg>
        `));
        
        this.load.image('enemy', 'data:image/svg+xml;base64,' + btoa(`
          <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" fill="#FF0000" stroke="#000" stroke-width="2"/>
            <circle cx="6" cy="6" r="2" fill="#000"/>
            <circle cx="18" cy="6" r="2" fill="#000"/>
          </svg>
        `));
        
        this.load.image('bullet', 'data:image/svg+xml;base64,' + btoa(`
          <svg width="4" height="8" xmlns="http://www.w3.org/2000/svg">
            <rect width="4" height="8" fill="#FFFF00"/>
          </svg>
        `));
      },
      
      create: function() {
        const scene = this;
        
        // Create player
        scene.player = scene.physics.add.sprite(400, 550, 'player');
        scene.player.setCollideWorldBounds(true);
        scene.player.body.setSize(28, 28);
        
        // Create groups
        scene.bullets = scene.physics.add.group();
        scene.enemies = scene.physics.add.group();
        
        // Game variables
        scene.gameActive = true;
        scene.gameScore = 0;
        scene.canShoot = true;
        scene.enemySpeed = 50;
        scene.enemySpawnRate = 2000;
        scene.wave = 1;
        
        // Score display
        scene.scoreText = scene.add.text(16, 16, 'Score: 0', {
          fontSize: '32px',
          fill: '#fff',
          stroke: '#000',
          strokeThickness: 2
        });
        
        scene.waveText = scene.add.text(16, 56, 'Wave: 1', {
          fontSize: '24px',
          fill: '#fff',
          stroke: '#000',
          strokeThickness: 2
        });
        
        // Spawn enemies
        scene.enemyTimer = scene.time.addEvent({
          delay: scene.enemySpawnRate,
          callback: () => {
            if (!scene.gameActive) return;
            
            const enemy = scene.enemies.create(
              Phaser.Math.Between(50, 750),
              50,
              'enemy'
            );
            enemy.body.setSize(20, 20);
            enemy.setVelocityY(scene.enemySpeed);
            enemy.points = 10 * scene.wave;
          },
          loop: true
        });
        
        // Increase difficulty
        scene.waveTimer = scene.time.addEvent({
          delay: 15000,
          callback: () => {
            scene.wave++;
            scene.enemySpeed += 25;
            scene.enemySpawnRate = Math.max(500, scene.enemySpawnRate - 200);
            scene.enemyTimer.delay = scene.enemySpawnRate;
            scene.waveText.setText('Wave: ' + scene.wave);
            
            const waveText = scene.add.text(400, 300, 'WAVE ' + scene.wave, {
              fontSize: '48px',
              fill: '#00ff00',
              stroke: '#000',
              strokeThickness: 3
            }).setOrigin(0.5);
            
            scene.time.delayedCall(2000, () => {
              waveText.destroy();
            });
          },
          loop: true
        });
        
        // Collisions
        scene.physics.add.overlap(scene.bullets, scene.enemies, (bullet, enemy) => {
          if (scene.gameActive) {
            bullet.destroy();
            enemy.destroy();
            scene.gameScore += enemy.points;
            scene.scoreText.setText('Score: ' + scene.gameScore);
            updateScore(scene.gameScore);
          }
        });
        
        scene.physics.add.overlap(scene.player, scene.enemies, () => {
          if (scene.gameActive) {
            scene.gameActive = false;
            scene.player.setTint(0xff0000);
            scene.enemyTimer.remove();
            scene.waveTimer.remove();
            scene.time.delayedCall(1000, () => {
              gameOver();
            });
          }
        });
        
        // Controls
        scene.cursors = scene.input.keyboard.createCursorKeys();
        scene.wasd = scene.input.keyboard.addKeys('W,S,A,D');
        scene.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      },
      
      update: function() {
        const scene = this;
        
        if (!scene.gameActive) return;
        
        // Player movement
        if (scene.cursors.left.isDown || scene.wasd.A.isDown) {
          scene.player.setVelocityX(-200);
        } else if (scene.cursors.right.isDown || scene.wasd.D.isDown) {
          scene.player.setVelocityX(200);
        } else {
          scene.player.setVelocityX(0);
        }
        
        // Shooting
        if (scene.spaceKey.isDown && scene.canShoot) {
          const bullet = scene.bullets.create(scene.player.x, scene.player.y - 20, 'bullet');
          bullet.body.setSize(4, 8);
          bullet.setVelocityY(-400);
          scene.canShoot = false;
          scene.time.delayedCall(200, () => {
            scene.canShoot = true;
          });
        }
        
        // Clean up off-screen objects
        scene.bullets.children.entries.forEach(bullet => {
          if (bullet.y < 0) {
            bullet.destroy();
          }
        });
        
        scene.enemies.children.entries.forEach(enemy => {
          if (enemy.y > 600) {
            enemy.destroy();
          }
        });
      }
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!currentGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800 flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Game Not Found</h2>
          <Link
            to="/games"
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold transition"
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/games"
              className="text-indigo-300 hover:text-white transition"
            >
              ← Back
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{currentGame.title}</h1>
              <p className="text-indigo-200">by {currentGame.user?.username || 'Unknown'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span>👾 {currentGame.playCount || 0} plays</span>
              <span>❤️ {currentGame.likesCount || 0} likes</span>
            </div>
            <button
              onClick={handleLike}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              {currentGame.isLiked ? '❤️' : '🤍'} Like
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Game Area */}
          <div className="lg:col-span-3">
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold">Game</h2>
                  <div className="text-lg font-semibold">Score: {score}</div>
                  <div className="text-lg font-semibold text-yellow-400">Best: {highScore}</div>
                  {sessionHighScore > 0 && (
                    <div className="text-lg font-semibold text-green-400">Session: {sessionHighScore}</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {gameState === 'playing' && (
                    <button
                      onClick={pauseGame}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                    >
                      Pause
                    </button>
                  )}
                  {gameState === 'paused' && (
                    <button
                      onClick={resumeGame}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                    >
                      Resume
                    </button>
                  )}
                  <button
                    onClick={resetGame}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                  >
                    Reset
                  </button>
                </div>
              </div>
              
              <div className="relative bg-black rounded-lg overflow-hidden">
                <div ref={gameRef} className="w-full h-full min-h-[600px]">
                  {gameState === 'menu' && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                      <div className="text-center">
                        <h3 className="text-3xl font-bold mb-4">{currentGame.title}</h3>
                        <p className="text-xl mb-6">{currentGame.description}</p>
                        <div className="mb-4">
                          <p className="text-lg">High Score: <span className="text-yellow-400">{highScore}</span></p>
                        </div>
                        <button
                          onClick={startGame}
                          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-xl transition"
                        >
                          Start Game
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {gameState === 'paused' && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                      <div className="text-center">
                        <h3 className="text-3xl font-bold mb-4">Game Paused</h3>
                        <p className="text-xl mb-6">Score: {score}</p>
                        <div className="flex gap-4 justify-center">
                          <button
                            onClick={resumeGame}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                          >
                            Resume
                          </button>
                          <button
                            onClick={resetGame}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                          >
                            Restart
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {gameState === 'gameOver' && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                      <div className="text-center">
                        <h3 className="text-3xl font-bold mb-4">Game Over!</h3>
                        <p className="text-2xl mb-4">Final Score: {score}</p>
                        <p className="text-xl mb-4">High Score: <span className="text-yellow-400">{highScore}</span></p>
                        {score === highScore && score > 0 && (
                          <p className="text-xl mb-4 text-yellow-400">🏆 New High Score!</p>
                        )}
                        <button
                          onClick={resetGame}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-xl transition"
                        >
                          Play Again
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur">
              <h3 className="text-lg font-bold mb-4">About this game</h3>
              <p className="text-indigo-200 text-sm mb-4">
                {currentGame.description || 'No description available'}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-indigo-200">Type:</span>
                  <span className="capitalize">{currentGame.type || 'Game'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-200">Plays:</span>
                  <span>{currentGame.playCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-200">Likes:</span>
                  <span>{currentGame.likesCount || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6 backdrop-blur">
              <h3 className="text-lg font-bold mb-4">Controls</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-indigo-200">Movement:</span>
                  <span className="font-mono">Arrow Keys / WASD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-200">Action:</span>
                  <span className="font-mono">Space</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-200">Click:</span>
                  <span className="font-mono">Mouse</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6 backdrop-blur">
              <h3 className="text-lg font-bold mb-4">Your Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-indigo-200">Current Score:</span>
                  <span className="font-bold">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-200">High Score:</span>
                  <span className="font-bold text-yellow-400">{highScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-200">Session Best:</span>
                  <span className="font-bold text-green-400">{sessionHighScore}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePlayer;