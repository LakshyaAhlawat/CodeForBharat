// src/components/game/PhaserGameEngine.jsx
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Phaser from 'phaser';
import { recordPlay } from '../../store/slices/gameSlice';

const PhaserGameEngine = ({ gameConfig, gameId, onScoreUpdate, onGameOver }) => {
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!gameRef.current || !gameConfig) return;

    // Clean up previous game
    if (phaserGameRef.current) {
      phaserGameRef.current.destroy(true);
      phaserGameRef.current = null;
    }

    const config = {
      type: Phaser.AUTO,
      width: gameConfig.width || 800,
      height: gameConfig.height || 600,
      parent: gameRef.current,
      backgroundColor: gameConfig.world?.background || '#87CEEB',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: gameConfig.world?.gravity || 300 },
          debug: false
        }
      },
      scene: createFlappyScene(gameConfig, onScoreUpdate, onGameOver),
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };

    try {
      phaserGameRef.current = new Phaser.Game(config);
      setIsLoaded(true);
      
      if (gameId) {
        dispatch(recordPlay(gameId));
      }
    } catch (error) {
      console.error('Failed to initialize Phaser game:', error);
    }

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, [gameConfig, gameId, dispatch, onScoreUpdate, onGameOver]);

  const createFlappyScene = (gameData, scoreCallback, gameOverCallback) => {
    return {
      key: 'FlappyScene',
      
      create: function() {
        const scene = this;
        
        // Add background color
        scene.add.rectangle(400, 300, 800, 600, 0x87CEEB);
        
        // Game variables
        scene.gameActive = false;
        scene.gameStarted = false;
        scene.gameScore = 0;
        scene.pipeSpeed = gameData.world?.scrollSpeed || 150;
        scene.flapForce = gameData.player?.flapForce || -250;
        
        // Create bird using simple graphics
        scene.bird = scene.add.rectangle(100, 300, 40, 40, 0xFFD700);
        scene.physics.add.existing(scene.bird);
        scene.bird.body.setCollideWorldBounds(false);
        
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
        
        scene.instructionText = scene.add.text(400, 400, 'SPACE or CLICK to FLY!', {
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
            scene.bird.body.setVelocityY(scene.flapForce);
          } else {
            scene.restartGame();
          }
        };
        
        scene.startGame = function() {
          scene.gameStarted = true;
          scene.gameActive = true;
          scene.instructionText.setVisible(false);
          scene.bird.body.setVelocityY(scene.flapForce);
          
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
          const topPipe = scene.add.rectangle(850, pipeY - 200, 60, 400, 0x228B22);
          scene.physics.add.existing(topPipe);
          topPipe.body.setImmovable(true);
          topPipe.body.setVelocityX(-scene.pipeSpeed);
          scene.pipes.add(topPipe);
          
          // Bottom pipe
          const bottomPipe = scene.add.rectangle(850, pipeY + gap + 200, 60, 400, 0x228B22);
          scene.physics.add.existing(bottomPipe);
          bottomPipe.body.setImmovable(true);
          bottomPipe.body.setVelocityX(-scene.pipeSpeed);
          scene.pipes.add(bottomPipe);
          
          // Mark for scoring
          topPipe.scored = false;
        };
        
        scene.addScore = function() {
          scene.gameScore++;
          scene.scoreText.setText(scene.gameScore);
          
          if (scoreCallback) {
            scoreCallback(scene.gameScore);
          }
        };
        
        scene.gameOver = function() {
          scene.gameActive = false;
          if (scene.pipeTimer) scene.pipeTimer.destroy();
          
          // Stop all pipes
          scene.pipes.children.entries.forEach(pipe => {
            if (pipe.body) pipe.body.setVelocityX(0);
          });
          
          if (gameOverCallback) {
            gameOverCallback(scene.gameScore, scene.gameScore);
          }
        };
        
        // Collision detection
        scene.physics.add.overlap(scene.bird, scene.pipes, scene.gameOver, null, scene);
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
      }
    };
  };

  return (
    <div className="relative">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg z-10">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading Phaser Game...</p>
          </div>
        </div>
      )}
      <div 
        ref={gameRef} 
        className="rounded-lg overflow-hidden border-2 border-white/20"
        style={{ 
          width: gameConfig?.width || 800, 
          height: gameConfig?.height || 600 
        }}
      />
    </div>
  );
};

export default PhaserGameEngine;