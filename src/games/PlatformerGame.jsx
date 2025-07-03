import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { recordPlay } from '../store/slices/gameSlice';

const PlatformerGame = ({ gameConfig, gameId }) => {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('playing');
  const [lives, setLives] = useState(3);
  const dispatch = useDispatch();

  useEffect(() => {
    if (gameId) {
      dispatch(recordPlay(gameId));
    }
  }, [gameId, dispatch]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Game configuration
    const config = {
      player: {
        x: 50,
        y: 400,
        width: 32,
        height: 32,
        velocityX: 0,
        velocityY: 0,
        speed: gameConfig?.player?.speed / 20 || 8,
        jumpForce: gameConfig?.player?.jumpHeight / 20 || 18,
        onGround: false,
        color: gameConfig?.player?.color || '#FF6B6B'
      },
      platforms: [
        { x: 0, y: 568, width: 800, height: 32, color: '#228B22' }, // Ground
        { x: 200, y: 480, width: 150, height: 20, color: '#8B4513' },
        { x: 400, y: 380, width: 120, height: 20, color: '#8B4513' },
        { x: 600, y: 280, width: 100, height: 20, color: '#8B4513' },
        { x: 100, y: 180, width: 120, height: 20, color: '#8B4513' },
        { x: 500, y: 120, width: 100, height: 20, color: '#8B4513' },
        { x: 300, y: 200, width: 80, height: 20, color: '#8B4513' }
      ],
      coins: [
        { x: 250, y: 450, width: 20, height: 20, collected: false },
        { x: 450, y: 350, width: 20, height: 20, collected: false },
        { x: 650, y: 250, width: 20, height: 20, collected: false },
        { x: 150, y: 150, width: 20, height: 20, collected: false },
        { x: 530, y: 90, width: 20, height: 20, collected: false },
        { x: 330, y: 170, width: 20, height: 20, collected: false },
        { x: 700, y: 500, width: 20, height: 20, collected: false }
      ],
      enemies: [
        { x: 300, y: 536, width: 24, height: 24, direction: 1, speed: 1, color: '#FF4444' },
        { x: 450, y: 356, width: 24, height: 24, direction: 1, speed: 1.5, color: '#FF4444' }
      ],
      gravity: gameConfig?.world?.gravity / 100 || 0.8,
      keys: {},
      score: 0,
      gameWon: false,
      respawnPoint: { x: 50, y: 400 }
    };

    gameRef.current = config;

    // Input handling
    const handleKeyDown = (e) => {
      config.keys[e.key.toLowerCase()] = true;
      
      if ((e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') && config.player.onGround) {
        e.preventDefault();
        config.player.velocityY = -config.player.jumpForce;
        config.player.onGround = false;
      }
    };

    const handleKeyUp = (e) => {
      config.keys[e.key.toLowerCase()] = false;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Collision detection
    const checkCollision = (rect1, rect2) => {
      return rect1.x < rect2.x + rect2.width &&
             rect1.x + rect1.width > rect2.x &&
             rect1.y < rect2.y + rect2.height &&
             rect1.y + rect1.height > rect2.y;
    };

    // Game loop
    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = gameConfig?.world?.background || '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!config.gameWon && gameState === 'playing') {
        // Handle input
        if (config.keys['a'] || config.keys['arrowleft']) {
          config.player.velocityX = -config.player.speed;
        } else if (config.keys['d'] || config.keys['arrowright']) {
          config.player.velocityX = config.player.speed;
        } else {
          config.player.velocityX *= 0.8; // Friction
        }

        // Apply gravity
        config.player.velocityY += config.gravity;

        // Update player position
        config.player.x += config.player.velocityX;
        config.player.y += config.player.velocityY;

        // Reset ground check
        config.player.onGround = false;

        // Platform collision
        config.platforms.forEach(platform => {
          if (checkCollision(config.player, platform)) {
            // Landing on top of platform
            if (config.player.velocityY > 0 && 
                config.player.y < platform.y) {
              config.player.y = platform.y - config.player.height;
              config.player.velocityY = 0;
              config.player.onGround = true;
            }
            // Hitting platform from below
            else if (config.player.velocityY < 0 && 
                     config.player.y > platform.y) {
              config.player.y = platform.y + platform.height;
              config.player.velocityY = 0;
            }
            // Side collision
            else if (config.player.velocityX > 0) {
              config.player.x = platform.x - config.player.width;
            } else if (config.player.velocityX < 0) {
              config.player.x = platform.x + platform.width;
            }
          }
        });

        // Coin collision
        config.coins.forEach(coin => {
          if (!coin.collected && checkCollision(config.player, coin)) {
            coin.collected = true;
            config.score += 10;
            setScore(config.score);
          }
        });

        // Enemy movement and collision
        config.enemies.forEach(enemy => {
          enemy.x += enemy.direction * enemy.speed;
          
          // Bounce off platforms
          let onPlatform = false;
          config.platforms.forEach(platform => {
            if (enemy.y + enemy.height >= platform.y &&
                enemy.y + enemy.height <= platform.y + platform.height + 5 &&
                enemy.x + enemy.width > platform.x &&
                enemy.x < platform.x + platform.width) {
              onPlatform = true;
            }
          });
          
          // Turn around at platform edges or walls
          if (!onPlatform || enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
            enemy.direction *= -1;
          }
          
          // Enemy collision with player
          if (checkCollision(config.player, enemy)) {
            // Player dies, respawn
            config.player.x = config.respawnPoint.x;
            config.player.y = config.respawnPoint.y;
            config.player.velocityX = 0;
            config.player.velocityY = 0;
            setLives(prev => {
              const newLives = prev - 1;
              if (newLives <= 0) {
                setGameState('gameOver');
              }
              return newLives;
            });
          }
        });

        // Check win condition
        if (config.coins.every(coin => coin.collected)) {
          config.gameWon = true;
          setGameState('won');
        }

        // Keep player in bounds
        if (config.player.x < 0) config.player.x = 0;
        if (config.player.x + config.player.width > canvas.width) {
          config.player.x = canvas.width - config.player.width;
        }
        
        // Reset if player falls
        if (config.player.y > canvas.height) {
          config.player.x = config.respawnPoint.x;
          config.player.y = config.respawnPoint.y;
          config.player.velocityX = 0;
          config.player.velocityY = 0;
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGameState('gameOver');
            }
            return newLives;
          });
        }
      }

      // Draw platforms
      config.platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Add platform border
        ctx.strokeStyle = '#1a5f1a';
        ctx.lineWidth = 2;
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
      });

      // Draw coins
      config.coins.forEach(coin => {
        if (!coin.collected) {
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(coin.x + coin.width/2, coin.y + coin.height/2, coin.width/2, 0, Math.PI * 2);
          ctx.fill();
          
          // Coin shine effect
          ctx.fillStyle = '#FFF700';
          ctx.beginPath();
          ctx.arc(coin.x + coin.width/2 - 3, coin.y + coin.height/2 - 3, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw enemies
      config.enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        // Enemy eyes
        ctx.fillStyle = 'white';
        ctx.fillRect(enemy.x + 4, enemy.y + 4, 4, 4);
        ctx.fillRect(enemy.x + 12, enemy.y + 4, 4, 4);
        ctx.fillStyle = 'black';
        ctx.fillRect(enemy.x + 5, enemy.y + 5, 2, 2);
        ctx.fillRect(enemy.x + 13, enemy.y + 5, 2, 2);
      });

      // Draw player
      ctx.fillStyle = config.player.color;
      ctx.fillRect(config.player.x, config.player.y, config.player.width, config.player.height);
      
      // Player eyes
      ctx.fillStyle = 'white';
      ctx.fillRect(config.player.x + 6, config.player.y + 6, 6, 6);
      ctx.fillRect(config.player.x + 18, config.player.y + 6, 6, 6);
      ctx.fillStyle = 'black';
      ctx.fillRect(config.player.x + 8, config.player.y + 8, 2, 2);
      ctx.fillRect(config.player.x + 20, config.player.y + 8, 2, 2);

      // Draw UI
      ctx.fillStyle = 'white';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'left';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      
      ctx.strokeText(`Score: ${config.score}`, 10, 30);
      ctx.fillText(`Score: ${config.score}`, 10, 30);
      
      ctx.strokeText(`Lives: ${lives}`, 10, 55);
      ctx.fillText(`Lives: ${lives}`, 10, 55);
      
      ctx.strokeText(`Coins: ${config.coins.filter(c => c.collected).length}/${config.coins.length}`, 10, 80);
      ctx.fillText(`Coins: ${config.coins.filter(c => c.collected).length}/${config.coins.length}`, 10, 80);

      // Win screen
      if (gameState === 'won') {
        ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeText('Victory!', canvas.width / 2, canvas.height / 2 - 60);
        ctx.fillText('Victory!', canvas.width / 2, canvas.height / 2 - 60);
        
        ctx.font = 'bold 24px Arial';
        ctx.strokeText(`Final Score: ${config.score}`, canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillText(`Final Score: ${config.score}`, canvas.width / 2, canvas.height / 2 - 10);
        
        ctx.font = '18px Arial';
        ctx.strokeText('All coins collected!', canvas.width / 2, canvas.height / 2 + 20);
        ctx.fillText('All coins collected!', canvas.width / 2, canvas.height / 2 + 20);
      }

      // Game over screen
      if (gameState === 'gameOver') {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.strokeText('Game Over!', canvas.width / 2, canvas.height / 2 - 60);
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 60);
        
        ctx.font = 'bold 24px Arial';
        ctx.strokeText(`Final Score: ${config.score}`, canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillText(`Final Score: ${config.score}`, canvas.width / 2, canvas.height / 2 - 10);
        
        ctx.font = '18px Arial';
        ctx.strokeText('No lives remaining!', canvas.width / 2, canvas.height / 2 + 20);
        ctx.fillText('No lives remaining!', canvas.width / 2, canvas.height / 2 + 20);
      }

      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameConfig, gameId, gameState, lives, dispatch]);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex gap-4 text-white">
        <div className="bg-black/30 px-4 py-2 rounded-lg">
          Score: <span className="font-bold">{score}</span>
        </div>
        <div className="bg-red-600/30 px-4 py-2 rounded-lg">
          Lives: <span className="font-bold">{lives}</span>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border-2 border-white/20 rounded-lg"
        style={{ background: gameConfig?.world?.background || '#87CEEB' }}
      />
      
      <div className="mt-4 text-center text-white">
        <p className="text-sm">Use WASD or Arrow Keys to move, Space to jump. Collect all coins to win!</p>
        <p className="text-xs text-gray-300">Avoid the red enemies!</p>
      </div>
    </div>
  );
};

export default PlatformerGame;