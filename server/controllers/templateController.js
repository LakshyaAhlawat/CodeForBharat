// controllers/templateController.js
const fs = require('fs');
const path = require('path');
const Game = require('../models/Game');

// Get all templates
exports.getAllTemplates = async (req, res) => {
  try {
    const templatesDir = path.join(__dirname, '../templates');
    
    if (!fs.existsSync(templatesDir)) {
      return res.json({
        success: true,
        count: 0,
        templates: []
      });
    }

    const templateFiles = fs.readdirSync(templatesDir).filter(file => file.endsWith('.json'));
    
    const templates = templateFiles.map(file => {
      try {
        const filePath = path.join(templatesDir, file);
        const templateData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return {
          id: templateData.name,
          _id: templateData.name,
          ...templateData,
          isActive: true
        };
      } catch (error) {
        console.error(`Error reading template file ${file}:`, error);
        return null;
      }
    }).filter(template => template !== null);

    res.json({
      success: true,
      count: templates.length,
      templates
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single template
exports.getTemplate = async (req, res) => {
  try {
    const templateName = req.params.id;
    const templatePath = path.join(__dirname, '../templates', `${templateName}.json`);
    
    if (!fs.existsSync(templatePath)) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    const templateData = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
    
    res.json({
      success: true,
      template: {
        id: templateData.name,
        _id: templateData.name,
        ...templateData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get template options
exports.getTemplateOptions = async (req, res) => {
  try {
    const templateName = req.params.id;
    const templatePath = path.join(__dirname, '../templates', `${templateName}.json`);
    
    if (!fs.existsSync(templatePath)) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    const templateData = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
    const customizationOptions = generateCustomizationOptions(templateData);
    
    res.json({
      success: true,
      options: customizationOptions,
      defaultSettings: templateData.defaultConfig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create game from template
exports.createGameFromTemplate = async (req, res) => {
  try {
    console.log('=== Creating game from template ===');
    console.log('Template ID:', req.params.id);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User ID:', req.user?.id);

    const templateName = req.params.id;
    const templatePath = path.join(__dirname, '../templates', `${templateName}.json`);
    
    if (!fs.existsSync(templatePath)) {
      return res.status(404).json({
        success: false,
        message: 'Template not found'
      });
    }

    const templateData = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
    const { title, description, customizations } = req.body;

    // Merge customizations with default config
    const gameConfig = customizations ? 
      mergeDeep(templateData.defaultConfig || {}, customizations) : 
      templateData.defaultConfig || {};

    const newGame = new Game({
      title: title.trim(),
      description: description || templateData.description,
      user: req.user.id,
      template: templateData.name,
      gameData: gameConfig,
      type: templateData.type || 'arcade',
      status: 'draft',
      assets: {
        thumbnail: req.file ? `/uploads/games/${req.file.filename}` : null
      }
    });

    const savedGame = await newGame.save();
    const populatedGame = await Game.findById(savedGame._id)
      .populate('user', 'username email');
    
    res.status(201).json({
      success: true,
      game: populatedGame,
      message: 'Game created successfully'
    });
  } catch (error) {
    console.error('=== Error creating game from template ===');
    console.error('Error details:', error);
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create game from template'
    });
  }
};

// Helper functions
function generateCustomizationOptions(templateData) {
  const options = [];
  
  if (templateData.defaultConfig.player) {
    options.push({
      category: 'Player Settings',
      options: [
        {
          key: 'player.speed',
          label: 'Player Speed',
          type: 'number',
          defaultValue: templateData.defaultConfig.player.speed,
          min: 50,
          max: 500
        },
        {
          key: 'player.jumpHeight',
          label: 'Jump Height',
          type: 'number',
          defaultValue: templateData.defaultConfig.player.jumpHeight,
          min: 0,
          max: 800
        }
      ]
    });
  }

  if (templateData.defaultConfig.world) {
    options.push({
      category: 'World Settings',
      options: [
        {
          key: 'world.gravity',
          label: 'Gravity',
          type: 'number',
          defaultValue: templateData.defaultConfig.world.gravity,
          min: 0,
          max: 1000
        },
        {
          key: 'world.background',
          label: 'Background Color',
          type: 'color',
          defaultValue: templateData.defaultConfig.world.background
        }
      ]
    });
  }

  return options;
}

function mergeDeep(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

// ✅ Make sure these are the ONLY exports at the end of the file
module.exports = {
  getAllTemplates: exports.getAllTemplates,
  getTemplate: exports.getTemplate,
  getTemplateOptions: exports.getTemplateOptions,
  createGameFromTemplate: exports.createGameFromTemplate
};

