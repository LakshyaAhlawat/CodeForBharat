// src/components/GamePreview.jsx
import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

const GamePreview = ({ gameConfig }) => {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (gameRef.current && gameConfig) {
      // Clean up existing game
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
      }

      // Game configuration
      const config = {
        type: Phaser.AUTO,
        width: gameConfig.world?.width || 400,
        height: gameConfig.world?.height || 300,
        parent: gameRef.current,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: gameConfig.world?.gravity || 800 },
            debug: false
          }
        },
        scene: {
          preload: preload,
          create: create,
          update: update
        },
        scale: {
          mode: Phaser.Scale.FIT,
          parent: gameRef.current,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: gameConfig.world?.width || 400,
          height: gameConfig.world?.height || 300
        }
      };

      let player, obstacles, cursors, gameOver = false;
      let obstacleTimer, currentScore = 0;

      function preload() {
        // Create simple colored rectangles as sprites
        this.add.graphics()
          .fillStyle(0x00ff00)
          .fillRect(0, 0, 32, 32)
          .generateTexture('player', 32, 32);

        this.add.graphics()
          .fillStyle(0xff0000)
          .fillRect(0, 0, 32, 64)
          .generateTexture('obstacle', 32, 64);

        this.add.graphics()
          .fillStyle(0x87CEEB)
          .fillRect(0, 0, config.width, config.height)
          .generateTexture('background', config.width, config.height);
      }

      function create() {
        // Background
        this.add.image(0, 0, 'background').setOrigin(0, 0);

        // Player
        player = this.physics.add.sprite(100, config.height - 100, 'player');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        // Obstacles group
        obstacles = this.physics.add.group();

        // Input
        cursors = this.input.keyboard.createCursorKeys();

        // Collision detection
        this.physics.add.overlap(player, obstacles, hitObstacle, null, this);

        // Score text
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
          fontSize: '16px',
          fill: '#000'
        });

        // Start spawning obstacles
        obstacleTimer = this.time.addEvent({
          delay: gameConfig.obstacles?.spawnRate || 2000,
          callback: spawnObstacle,
          callbackScope: this,
          loop: true
        });

        setIsPlaying(true);
      }

      function update() {
        if (gameOver) return;

        // Player controls
        if (cursors.space.isDown && player.body.touching.down) {
          player.setVelocityY(-(gameConfig.player?.jumpForce || 500));
        }

        // Move obstacles
        obstacles.children.entries.forEach(obstacle => {
          obstacle.x -= gameConfig.obstacles?.speed || 150;
          
          // Remove obstacles that are off screen and increase score
          if (obstacle.x < -50) {
            currentScore += 10;
            setScore(currentScore);
            obstacle.destroy();
          }
        });
      }

      function spawnObstacle() {
        if (gameOver) return;
        
        const obstacle = obstacles.create(config.width, config.height - 64, 'obstacle');
        obstacle.setVelocityX(-(gameConfig.obstacles?.speed || 150));
        obstacle.body.setImmovable(true);
      }

      function hitObstacle() {
        gameOver = true;
        setIsPlaying(false);
        
        // Stop obstacle spawning
        if (obstacleTimer) {
          obstacleTimer.remove();
        }

        // Game over text
        this.add.text(config.width / 2, config.height / 2, 'Game Over!', {
          fontSize: '24px',
          fill: '#ff0000'
        }).setOrigin(0.5);

        this.add.text(config.width / 2, config.height / 2 + 40, 'Press R to Restart', {
          fontSize: '16px',
          fill: '#000'
        }).setOrigin(0.5);

        // Restart functionality
        this.input.keyboard.on('keydown-R', () => {
          this.scene.restart();
          gameOver = false;
          currentScore = 0;
          setScore(0);
        });
      }

      // Create and start the game
      phaserGameRef.current = new Phaser.Game(config);
    }

    // Cleanup function
    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, [gameConfig]);

  return (
    <div className="space-y-4">
      {/* Game Container */}
      <div className="relative bg-black rounded-lg overflow-hidden">
        <div ref={gameRef} className="w-full" />
        
        {/* Game Status Overlay */}
        <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
          Score: {score}
        </div>
        
        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
          {isPlaying ? '🟢 Playing' : '🔴 Stopped'}
        </div>
      </div>

      {/* Controls Info */}
      <div className="bg-white/10 rounded-lg p-3 text-sm">
        <h4 className="font-semibold mb-2">Controls:</h4>
        <ul className="space-y-1 text-indigo-200">
          <li>• <kbd className="bg-white/20 px-2 py-1 rounded">SPACE</kbd> - Jump</li>
          <li>• <kbd className="bg-white/20 px-2 py-1 rounded">R</kbd> - Restart (when game over)</li>
        </ul>
      </div>

      {/* Current Config Display */}
      <div className="bg-white/10 rounded-lg p-3 text-sm">
        <h4 className="font-semibold mb-2">Current Settings:</h4>
        <div className="grid grid-cols-2 gap-2 text-indigo-200">
          <div>Player Speed: {gameConfig.player?.speed || 200}</div>
          <div>Jump Force: {gameConfig.player?.jumpForce || 500}</div>
          <div>Gravity: {gameConfig.world?.gravity || 800}</div>
          <div>Obstacle Speed: {gameConfig.obstacles?.speed || 150}</div>
        </div>
      </div>
    </div>
  );
};

export default GamePreview;