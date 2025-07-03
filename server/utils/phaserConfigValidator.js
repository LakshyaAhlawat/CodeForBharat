// Validate complete Phaser configuration
const validatePhaserConfig = (config) => {
  const errors = [];
  const warnings = [];

  try {
    // Validate basic structure
    if (!config || typeof config !== 'object') {
      errors.push('Configuration must be a valid object');
      return { isValid: false, errors, warnings };
    }

    // Validate game type
    const validTypes = ['platformer', 'runner', 'flappy', 'shooter'];
    if (!config.type || !validTypes.includes(config.type)) {
      errors.push(`Game type must be one of: ${validTypes.join(', ')}`);
    }

    // Validate dimensions
    validateDimensions(config, errors, warnings);

    // Validate player configuration
    validatePlayerConfig(config.player, errors, warnings);

    // Validate world configuration
    validateWorldConfig(config.world, errors, warnings);

    // Validate enemies
    validateEnemiesConfig(config.enemies, errors, warnings);

    // Validate collectibles
    validateCollectiblesConfig(config.collectibles, errors, warnings);

    // Validate controls
    validateControlsConfig(config.controls, config.type, errors, warnings);

    // Type-specific validation
    validateTypeSpecificConfig(config, errors, warnings);

  } catch (error) {
    errors.push('Invalid configuration structure: ' + error.message);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Validate game dimensions
const validateDimensions = (config, errors, warnings) => {
  const { width, height } = config;

  if (width !== undefined) {
    if (typeof width !== 'number' || width < 400 || width > 1920) {
      errors.push('Width must be a number between 400 and 1920');
    } else if (width % 32 !== 0) {
      warnings.push('Width should be divisible by 32 for optimal performance');
    }
  }

  if (height !== undefined) {
    if (typeof height !== 'number' || height < 300 || height > 1080) {
      errors.push('Height must be a number between 300 and 1080');
    } else if (height % 32 !== 0) {
      warnings.push('Height should be divisible by 32 for optimal performance');
    }
  }
};

// Validate player configuration
const validatePlayerConfig = (player, errors, warnings) => {
  if (!player || typeof player !== 'object') {
    errors.push('Player configuration is required');
    return;
  }

  // Speed validation
  if (player.speed !== undefined) {
    if (typeof player.speed !== 'number' || player.speed < 50 || player.speed > 500) {
      errors.push('Player speed must be a number between 50 and 500');
    }
  }

  // Jump height validation
  if (player.jumpHeight !== undefined) {
    if (typeof player.jumpHeight !== 'number' || player.jumpHeight < 100 || player.jumpHeight > 800) {
      errors.push('Player jump height must be a number between 100 and 800');
    }
  }

  // Sprite validation
  if (player.sprite !== undefined && typeof player.sprite !== 'string') {
    errors.push('Player sprite must be a string');
  }
};

// Validate world configuration
const validateWorldConfig = (world, errors, warnings) => {
  if (!world || typeof world !== 'object') {
    warnings.push('World configuration not provided, using defaults');
    return;
  }

  // Gravity validation
  if (world.gravity !== undefined) {
    if (typeof world.gravity !== 'number' || world.gravity < 0 || world.gravity > 1000) {
      errors.push('World gravity must be a number between 0 and 1000');
    }
  }

  // Background validation
  if (world.background !== undefined) {
    if (typeof world.background !== 'string') {
      errors.push('World background must be a string (color or image URL)');
    } else if (world.background.startsWith('#')) {
      // Validate hex color
      if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(world.background)) {
        errors.push('Invalid hex color format for background');
      }
    }
  }

  // Platforms validation
  if (world.platforms) {
    if (!Array.isArray(world.platforms)) {
      errors.push('World platforms must be an array');
    } else {
      world.platforms.forEach((platform, index) => {
        validatePlatform(platform, index, errors);
      });
    }
  }
};

// Validate individual platform
const validatePlatform = (platform, index, errors) => {
  if (!platform || typeof platform !== 'object') {
    errors.push(`Platform ${index} must be an object`);
    return;
  }

  const requiredFields = ['x', 'y', 'width', 'height'];
  requiredFields.forEach(field => {
    if (platform[field] === undefined || typeof platform[field] !== 'number') {
      errors.push(`Platform ${index} missing required numeric field: ${field}`);
    }
  });

  if (platform.width <= 0 || platform.height <= 0) {
    errors.push(`Platform ${index} must have positive width and height`);
  }
};

// Validate enemies configuration
const validateEnemiesConfig = (enemies, errors, warnings) => {
  if (!enemies) {
    warnings.push('No enemies configured');
    return;
  }

  if (!Array.isArray(enemies)) {
    errors.push('Enemies must be an array');
    return;
  }

  if (enemies.length > 50) {
    warnings.push('Large number of enemies may impact performance');
  }

  enemies.forEach((enemy, index) => {
    validateEnemy(enemy, index, errors);
  });
};

// Validate individual enemy
const validateEnemy = (enemy, index, errors) => {
  if (!enemy || typeof enemy !== 'object') {
    errors.push(`Enemy ${index} must be an object`);
    return;
  }

  if (!enemy.type || typeof enemy.type !== 'string') {
    errors.push(`Enemy ${index} must have a type (string)`);
  }

  if (enemy.speed !== undefined && (typeof enemy.speed !== 'number' || enemy.speed < 0)) {
    errors.push(`Enemy ${index} speed must be a positive number`);
  }

  if (enemy.health !== undefined && (typeof enemy.health !== 'number' || enemy.health <= 0)) {
    errors.push(`Enemy ${index} health must be a positive number`);
  }
};

// Validate collectibles configuration
const validateCollectiblesConfig = (collectibles, errors, warnings) => {
  if (!collectibles) {
    warnings.push('No collectibles configured');
    return;
  }

  if (!Array.isArray(collectibles)) {
    errors.push('Collectibles must be an array');
    return;
  }

  collectibles.forEach((collectible, index) => {
    validateCollectible(collectible, index, errors);
  });
};

// Validate individual collectible
const validateCollectible = (collectible, index, errors) => {
  if (!collectible || typeof collectible !== 'object') {
    errors.push(`Collectible ${index} must be an object`);
    return;
  }

  if (!collectible.type || typeof collectible.type !== 'string') {
    errors.push(`Collectible ${index} must have a type (string)`);
  }

  if (collectible.points !== undefined && typeof collectible.points !== 'number') {
    errors.push(`Collectible ${index} points must be a number`);
  }
};

// Validate controls configuration
const validateControlsConfig = (controls, gameType, errors, warnings) => {
  if (!controls || typeof controls !== 'object') {
    warnings.push('No custom controls configured, using defaults');
    return;
  }

  const validKeys = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'SPACE', 'ENTER', 'SHIFT', 'CTRL', 'ALT'
  ];

  Object.keys(controls).forEach(action => {
    const key = controls[action];
    if (typeof key !== 'string' || !validKeys.includes(key)) {
      errors.push(`Invalid control key "${key}" for action "${action}"`);
    }
  });

  // Game type specific control validation
  if (gameType === 'platformer') {
    if (!controls.left && !controls.right && !controls.jump) {
      warnings.push('Platformer games typically need left, right, and jump controls');
    }
  } else if (gameType === 'flappy') {
    if (!controls.flap && !controls.jump) {
      warnings.push('Flappy games typically need a flap or jump control');
    }
  }
};

// Validate type-specific configurations
const validateTypeSpecificConfig = (config, errors, warnings) => {
  switch (config.type) {
    case 'platformer':
      validatePlatformerConfig(config, errors, warnings);
      break;
    case 'runner':
      validateRunnerConfig(config, errors, warnings);
      break;
    case 'flappy':
      validateFlappyConfig(config, errors, warnings);
      break;
    case 'shooter':
      validateShooterConfig(config, errors, warnings);
      break;
  }
};

// Validate platformer-specific config
const validatePlatformerConfig = (config, errors, warnings) => {
  if (!config.world?.platforms || config.world.platforms.length === 0) {
    warnings.push('Platformer games should have platforms configured');
  }

  if (config.world?.gravity === 0) {
    warnings.push('Platformer games typically need gravity');
  }
};

// Validate runner-specific config
const validateRunnerConfig = (config, errors, warnings) => {
  if (!config.world?.scrollSpeed) {
    warnings.push('Runner games should have scroll speed configured');
  }

  if (!config.enemies || config.enemies.length === 0) {
    warnings.push('Runner games should have obstacles/enemies');
  }
};

// Validate flappy-specific config
const validateFlappyConfig = (config, errors, warnings) => {
  if (config.world?.gravity === undefined || config.world.gravity < 300) {
    warnings.push('Flappy games typically need higher gravity (300+)');
  }

  if (!config.player?.flapForce) {
    warnings.push('Flappy games should have flap force configured');
  }
};

// Validate shooter-specific config
const validateShooterConfig = (config, errors, warnings) => {
  if (config.world?.gravity !== 0) {
    warnings.push('Shooter games typically have no gravity');
  }

  if (!config.player?.fireRate) {
    warnings.push('Shooter games should have fire rate configured');
  }
};

// Sanitize configuration (remove invalid values)
const sanitizeConfig = (config) => {
  const sanitized = JSON.parse(JSON.stringify(config));

  // Set defaults for missing values
  if (!sanitized.width) sanitized.width = 800;
  if (!sanitized.height) sanitized.height = 600;
  if (!sanitized.world) sanitized.world = {};
  if (!sanitized.world.gravity && sanitized.world.gravity !== 0) sanitized.world.gravity = 300;
  if (!sanitized.world.background) sanitized.world.background = '#87CEEB';

  // Ensure arrays exist
  if (!sanitized.enemies) sanitized.enemies = [];
  if (!sanitized.collectibles) sanitized.collectibles = [];

  return sanitized;
};

// Get validation summary
const getValidationSummary = (validationResult) => {
  const { isValid, errors, warnings } = validationResult;
  
  return {
    status: isValid ? 'valid' : 'invalid',
    errorCount: errors.length,
    warningCount: warnings.length,
    issues: [...errors, ...warnings],
    severity: errors.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : 'none'
  };
};

module.exports = {
  validatePhaserConfig,
  sanitizeConfig,
  getValidationSummary
};