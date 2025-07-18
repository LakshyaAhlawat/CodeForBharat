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

  // Add this function at the top of your component, before the useEffect
  const getBackgroundStyle = (backgroundType) => {
    switch (backgroundType) {
      case 'day':
        return {
          color: '#87CEEB',
          gradient: 'linear-gradient(to bottom, #87CEEB 0%, #98D8E8 100%)'
        };
      case 'night':
        return {
          color: '#191970',
          gradient: 'linear-gradient(to bottom, #191970 0%, #4169E1 100%)'
        };
      case 'sunset':
        return {
          color: '#FF6347',
          gradient: 'linear-gradient(to bottom, #FF6347 0%, #FF69B4 100%)'
        };
      case 'space':
        return {
          color: '#000000',
          gradient: 'linear-gradient(to bottom, #000000 0%, #4B0082 100%)'
        };
      case 'forest':
        return {
          color: '#228B22',
          gradient: 'linear-gradient(to bottom, #87CEEB 0%, #228B22 100%)'
        };
      default:
        return {
          color: '#87CEEB',
          gradient: 'linear-gradient(to bottom, #87CEEB 0%, #98D8E8 100%)'
        };
    }
  };

  // Add enhanced background rendering function
  const drawBackground = (ctx, backgroundType) => {
    const canvas = ctx.canvas;
    
    // Create gradient based on background type
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    
    switch (backgroundType) {
      case 'day':
        gradient.addColorStop(0, '#87CEEB'); // Sky blue
        gradient.addColorStop(0.7, '#98D8E8'); // Light blue
        gradient.addColorStop(1, '#B0E0E6'); // Powder blue
        break;
      case 'night':
        gradient.addColorStop(0, '#191970'); // Midnight blue
        gradient.addColorStop(0.3, '#4169E1'); // Royal blue
        gradient.addColorStop(1, '#483D8B'); // Dark slate blue
        break;
      case 'sunset':
        gradient.addColorStop(0, '#FF6347'); // Tomato
        gradient.addColorStop(0.5, '#FF69B4'); // Hot pink
        gradient.addColorStop(1, '#FFB6C1'); // Light pink
        break;
      case 'space':
        gradient.addColorStop(0, '#000000'); // Black
        gradient.addColorStop(0.5, '#4B0082'); // Indigo
        gradient.addColorStop(1, '#800080'); // Purple
        break;
      case 'forest':
        gradient.addColorStop(0, '#87CEEB'); // Sky blue
        gradient.addColorStop(0.6, '#228B22'); // Forest green
        gradient.addColorStop(1, '#006400'); // Dark green
        break;
      default:
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98D8E8');
    }
    
    // Fill background with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add decorative elements based on background type
    if (backgroundType === 'day') {
      // Draw sun
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(canvas.width - 80, 80, 40, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw clouds
      drawCloud(ctx, 150, 100, 0.8);
      drawCloud(ctx, 400, 60, 0.6);
      drawCloud(ctx, 650, 120, 0.7);
    } else if (backgroundType === 'night') {
      // Draw moon
      ctx.fillStyle = '#F0F8FF';
      ctx.beginPath();
      ctx.arc(canvas.width - 80, 80, 35, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw stars
      ctx.fillStyle = '#FFFF00';
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height * 0.6);
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (backgroundType === 'sunset') {
      // Draw larger sun
      ctx.fillStyle = '#FF4500';
      ctx.beginPath();
      ctx.arc(canvas.width - 100, 120, 50, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw silhouette clouds
      drawCloud(ctx, 200, 80, 0.9, '#8B4513');
      drawCloud(ctx, 500, 100, 0.7, '#8B4513');
    } else if (backgroundType === 'space') {
      // Draw planets
      ctx.fillStyle = '#4169E1';
      ctx.beginPath();
      ctx.arc(100, 100, 30, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#FF6347';
      ctx.beginPath();
      ctx.arc(canvas.width - 60, 150, 25, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw stars
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (backgroundType === 'forest') {
      // Draw trees at bottom
      ctx.fillStyle = '#228B22';
      for (let i = 0; i < 10; i++) {
        const x = i * 80;
        const height = 100 + Math.random() * 50;
        ctx.fillRect(x, canvas.height - height, 60, height);
      }
    }
  };

  // Helper function to draw clouds
  const drawCloud = (ctx, x, y, scale = 1, color = '#FFFFFF') => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 25 * scale, 0, Math.PI * 2);
    ctx.arc(x + 25 * scale, y, 35 * scale, 0, Math.PI * 2);
    ctx.arc(x + 50 * scale, y, 25 * scale, 0, Math.PI * 2);
    ctx.arc(x + 30 * scale, y - 15 * scale, 20 * scale, 0, Math.PI * 2);
    ctx.fill();
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
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background with selected type - FIX THIS LINE
      const backgroundType = gameConfig?.world?.backgroundType || gameConfig?.phaserConfig?.world?.backgroundType || 'day';
      console.log('Background type:', backgroundType); // Add this for debugging
      drawBackground(ctx, backgroundType);
      
      if (gameState === 'waiting') {
        // Start screen
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
        
        // Draw bird
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
        // Game playing logic
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
            if (config.bird.x + config.bird.width > pipe.x &&
                config.bird.x < pipe.x + config.pipeWidth &&
                config.bird.y < pipe.topHeight) {
              config.gameOver = true;
              setGameState('gameOver');
              onGameOver(config.score, highScore);
            }

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

        // Draw pipes
        config.pipes.forEach(pipe => {
          ctx.fillStyle = '#228B22';
          ctx.fillRect(pipe.x, 0, config.pipeWidth, pipe.topHeight);
          ctx.fillRect(pipe.x, pipe.bottomY, config.pipeWidth, pipe.bottomHeight);
          
          ctx.fillStyle = '#1e5f1e';
          ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, config.pipeWidth + 10, 20);
          ctx.fillRect(pipe.x - 5, pipe.bottomY, config.pipeWidth + 10, 20);
        });

        // Draw bird
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

      // Draw score (always visible during play)
      if (gameState === 'playing' || gameState === 'gameOver') {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeText(`Score: ${config.score}`, 20, 40);
        ctx.fillText(`Score: ${config.score}`, 20, 40);
        
        ctx.font = 'bold 18px Arial';
        ctx.strokeText(`Best: ${highScore}`, 20, 70);
        ctx.fillText(`Best: ${highScore}`, 20, 70);
      }

      // Game over screen
      if (gameState === 'gameOver') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeText('Game Over!', canvas.width / 2, canvas.height / 2 - 40);
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 40);
        
        ctx.font = '20px Arial';
        ctx.strokeText(`Final Score: ${config.score}`, canvas.width / 2, canvas.height / 2);
        ctx.fillText(`Final Score: ${config.score}`, canvas.width / 2, canvas.height / 2);
        
        ctx.font = '16px Arial';
        ctx.strokeText('Press SPACE or Click to Restart', canvas.width / 2, canvas.height / 2 + 40);
        ctx.fillText('Press SPACE or Click to Restart', canvas.width / 2, canvas.height / 2 + 40);
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