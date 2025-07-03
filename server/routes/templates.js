const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const gameController = require('../controllers/gameController');
const { auth } = require('../middleware/auth');
const { validateTemplateGame } = require('../middleware/validation');

// Get all templates
router.get('/', templateController.getAllTemplates);

// Get single template
router.get('/:id', templateController.getTemplate);

// Get template customization options
router.get('/:id/options', templateController.getTemplateOptions);

// Create game from template with file upload
router.post('/:id/create-game', auth, gameController.uploadMiddleware, validateTemplateGame, templateController.createGameFromTemplate);

module.exports = router;