import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { recordPlay } from '../store/slices/gameSlice';

const FlappyBirdGame = ({ 
  gameConfig = {}, 
  gameId = null, 
  onScoreUpdate = () => {}, 
  onGameOver = () => {} 
}) => {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, gameOver
  const [highScore, setHighScore] = useState(0);
  const dispatch = useDispatch();

  // ✅ Helper function for rounded rectangles (cross-browser compatible)
  const drawRoundedRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Game configuration from template with better defaults
    const config = {
      bird: {
        x: 100,
        y: canvas.height / 2,
        width: 30,
        height: 30,
        velocity: 0,
        gravity: gameConfig?.world?.gravity ? gameConfig.world.gravity / 100 : 0.5, // ✅ Reduced gravity
        jumpForce: gameConfig?.player?.flapForce ? gameConfig.player.flapForce / 20 : -10, // ✅ Better jump force
        color: gameConfig?.player?.color || '#FFD700'
      },
      pipes: [],
      score: 0,
      pipeWidth: 80,
      pipeGap: 150,
      pipeSpeed: gameConfig?.world?.scrollSpeed ? gameConfig.world.scrollSpeed / 50 : 2, // ✅ Slower pipes
      gameStarted: false, // ✅ Important flag
      gameOver: false
    };

    gameRef.current = config;

    // Create pipe
    const createPipe = () => {
      const minHeight = 50;
      const maxHeight = canvas.height - config.pipeGap - 100;
      const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
      
      return {
        x: canvas.width,
        topHeight: topHeight,
        bottomY: topHeight + config.pipeGap,
        bottomHeight: canvas.height - (topHeight + config.pipeGap),
        passed: false,
        counted: false
      };
    };

    // ✅ Don't add pipes until game starts
    // config.pipes.push(createPipe());

    // Input handling
    const handleInput = (e) => {
      if (e.code === 'Space' || e.type === 'click') {
        e.preventDefault();
        
        if (gameState === 'waiting') {
          setGameState('playing');
          config.gameStarted = true;
          config.bird.velocity = config.bird.jumpForce; // ✅ Initial flap when starting
          config.pipes.push(createPipe()); // ✅ Add first pipe when starting
          
          if (gameId) {
            dispatch(recordPlay(gameId));
          }
        }
        
        if (gameState === 'playing' && !config.gameOver) {
          config.bird.velocity = config.bird.jumpForce;
        }
        
        if (gameState === 'gameOver') {
          // Restart game
          config.bird.x = 100;
          config.bird.y = canvas.height / 2;
          config.bird.velocity = 0;
          config.pipes = []; // ✅ Clear pipes on restart
          config.score = 0;
          config.gameOver = false;
          config.gameStarted = false;
          setScore(0);
          setGameState('waiting');
        }
      }
    };

    // Event listeners
    document.addEventListener('keydown', handleInput);
    canvas.addEventListener('click', handleInput);

    // Game loop
    const gameLoop = () => {
      // Clear canvas with background color
      ctx.fillStyle = gameConfig?.world?.background || '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (gameState === 'waiting') {
        // Start screen - bird doesn't fall yet
        ctx.fillStyle = 'white';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeText('Flappy Bird', canvas.width / 2, canvas.height / 2 - 60);
        ctx.fillText('Flappy Bird', canvas.width / 2, canvas.height / 2 - 60);
        
        ctx.font = '18px Arial';
        ctx.strokeText('Press SPACE or Click to Start', canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillText('Press SPACE or Click to Start', canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.font = '14px Arial';
        ctx.strokeText('Press SPACE or Click to Flap', canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillText('Press SPACE or Click to Flap', canvas.width / 2, canvas.height / 2 + 10);
        
        if (highScore > 0) {
          ctx.strokeText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2 + 40);
          ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2 + 40);
        }
        
        // ✅ Draw bird using custom rounded rect function
        ctx.fillStyle = config.bird.color;
        drawRoundedRect(ctx, config.bird.x, config.bird.y, config.bird.width, config.bird.height, 5);
        ctx.fill();

        // Draw bird eye
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(config.bird.x + 20, config.bird.y + 10, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(config.bird.x + 22, config.bird.y + 10, 3, 0, Math.PI * 2);
        ctx.fill();
      } 
      else if (gameState === 'playing' && !config.gameOver) {
        // ✅ Only apply physics when game is actually playing
        if (config.gameStarted) {
          // Update bird physics
          config.bird.velocity += config.bird.gravity;
          config.bird.y += config.bird.velocity;

          // Update pipes
          config.pipes.forEach((pipe, index) => {
            pipe.x -= config.pipeSpeed;

            // Check if bird passed pipe for scoring
            if (!pipe.counted && pipe.x + config.pipeWidth < config.bird.x) {
              pipe.counted = true;
              config.score++;
              setScore(config.score);
              onScoreUpdate(config.score);
            }

            // Remove off-screen pipes
            if (pipe.x + config.pipeWidth < 0) {
              config.pipes.splice(index, 1);
            }
          });

          // Add new pipes
          if (config.pipes.length === 0 || config.pipes[config.pipes.length - 1].x < canvas.width - 200) {
            config.pipes.push(createPipe());
          }

          // Collision detection
          config.pipes.forEach(pipe => {
            // Top pipe collision
            if (config.bird.x + config.bird.width > pipe.x &&
                config.bird.x < pipe.x + config.pipeWidth &&
                config.bird.y < pipe.topHeight) {
              config.gameOver = true;
              setGameState('gameOver');
              onGameOver(config.score, highScore);
            }

            // Bottom pipe collision
            if (config.bird.x + config.bird.width > pipe.x &&
                config.bird.x < pipe.x + config.pipeWidth &&
                config.bird.y + config.bird.height > pipe.bottomY) {
              config.gameOver = true;
              setGameState('gameOver');
              onGameOver(config.score, highScore);
            }
          });

          // Ground and ceiling collision
          if (config.bird.y + config.bird.height > canvas.height || config.bird.y < 0) {
            config.gameOver = true;
            setGameState('gameOver');
            onGameOver(config.score, highScore);
          }
        }

        // ✅ Draw pipes with better visibility
        config.pipes.forEach(pipe => {
          // Top pipe
          ctx.fillStyle = '#228B22';
          ctx.fillRect(pipe.x, 0, config.pipeWidth, pipe.topHeight);
          
          // Bottom pipe
          ctx.fillRect(pipe.x, pipe.bottomY, config.pipeWidth, pipe.bottomHeight);
          
          // Pipe caps for better visual
          ctx.fillStyle = '#1e5f1e';
          ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, config.pipeWidth + 10, 20);
          ctx.fillRect(pipe.x - 5, pipe.bottomY, config.pipeWidth + 10, 20);
          
          // ✅ Add pipe borders for better visibility
          ctx.strokeStyle = '#0f3f0f';
          ctx.lineWidth = 2;
          ctx.strokeRect(pipe.x, 0, config.pipeWidth, pipe.topHeight);
          ctx.strokeRect(pipe.x, pipe.bottomY, config.pipeWidth, pipe.bottomHeight);
        });

        // ✅ Draw bird using custom rounded rect function
        ctx.fillStyle = config.bird.color;
        drawRoundedRect(ctx, config.bird.x, config.bird.y, config.bird.width, config.bird.height, 5);
        ctx.fill();

        // Draw bird eye
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(config.bird.x + 20, config.bird.y + 10, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(config.bird.x + 22, config.bird.y + 10, 3, 0, Math.PI * 2);
        ctx.fill();

        // Add beak
        ctx.fillStyle = '#FFA500';
        ctx.beginPath();
        ctx.moveTo(config.bird.x + config.bird.width, config.bird.y + 12);
        ctx.lineTo(config.bird.x + config.bird.width + 8, config.bird.y + 15);
        ctx.lineTo(config.bird.x + config.bird.width, config.bird.y + 18);
        ctx.closePath();
        ctx.fill();
      }

      // Draw score (always visible during play)
      if (gameState === 'playing' || gameState === 'gameOver') {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeText(`Score: ${config.score}`, 10, 40);
        ctx.fillText(`Score: ${config.score}`, 10, 40);
      }

      // Game over screen
      if (gameState === 'gameOver') {
        // Update high score
        if (config.score > highScore) {
          setHighScore(config.score);
        }
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeText('Game Over!', canvas.width / 2, canvas.height / 2 - 60);
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 60);
        
        ctx.font = 'bold 20px Arial';
        ctx.strokeText(`Final Score: ${config.score}`, canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillText(`Final Score: ${config.score}`, canvas.width / 2, canvas.height / 2 - 20);
        
        if (config.score > 0 && config.score >= highScore) {
          ctx.fillStyle = '#FFD700';
          ctx.strokeText('NEW HIGH SCORE!', canvas.width / 2, canvas.height / 2 + 10);
          ctx.fillText('NEW HIGH SCORE!', canvas.width / 2, canvas.height / 2 + 10);
        }
        
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.strokeText('Press SPACE or Click to Restart', canvas.width / 2, canvas.height / 2 + 50);
        ctx.fillText('Press SPACE or Click to Restart', canvas.width / 2, canvas.height / 2 + 50);
      }

      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      document.removeEventListener('keydown', handleInput);
      canvas.removeEventListener('click', handleInput);
    };
  }, [gameConfig, gameId, gameState, highScore, dispatch, onScoreUpdate, onGameOver]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex gap-4 text-white">
        <div className="bg-black/30 px-4 py-2 rounded-lg">
          Score: <span className="font-bold">{score}</span>
        </div>
        {highScore > 0 && (
          <div className="bg-yellow-600/30 px-4 py-2 rounded-lg">
            High: <span className="font-bold">{highScore}</span>
          </div>
        )}
      </div>
      
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border-2 border-white/20 rounded-lg cursor-pointer"
        style={{ background: gameConfig?.world?.background || '#87CEEB' }}
      />
      
      <div className="mt-4 text-center text-white">
        <p className="text-sm">Use SPACE or Click to flap and avoid the pipes!</p>
        {gameState === 'waiting' && <p className="text-xs text-gray-300">Click anywhere to start</p>}
        {gameState === 'playing' && <p className="text-xs text-gray-300">Keep flapping to stay airborne!</p>}
      </div>
    </div>
  );
};

export default FlappyBirdGame;