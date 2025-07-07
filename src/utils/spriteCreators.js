// src/utils/spriteCreators.js
export const createBirdSprite = (color = '#FFD700') => {
  const canvas = document.createElement('canvas');
  canvas.width = 50;
  canvas.height = 40;
  const ctx = canvas.getContext('2d');
  
  // Bird body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(25, 20, 20, 15, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Bird wing
  ctx.fillStyle = '#FFA500';
  ctx.beginPath();
  ctx.ellipse(30, 20, 12, 8, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Bird eye
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(32, 15, 5, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(34, 15, 2, 0, 2 * Math.PI);
  ctx.fill();
  
  // Bird beak
  ctx.fillStyle = '#FF8C00';
  ctx.beginPath();
  ctx.moveTo(40, 18);
  ctx.lineTo(48, 20);
  ctx.lineTo(40, 22);
  ctx.closePath();
  ctx.fill();
  
  return canvas.toDataURL();
};

export const createPipeSprite = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 60;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  
  // Pipe body
  ctx.fillStyle = '#228B22';
  ctx.fillRect(0, 0, 60, 400);
  
  // Pipe highlights
  ctx.fillStyle = '#32CD32';
  ctx.fillRect(5, 0, 5, 400);
  ctx.fillRect(50, 0, 5, 400);
  
  return canvas.toDataURL();
};

export const createBackgroundSprite = (color = '#87CEEB') => {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');
  
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, 600);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, '#4682B4');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 800, 600);
  
  return canvas.toDataURL();
};

// Add other sprite creators (platformer, runner, shooter sprites)