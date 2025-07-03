const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const { auth } = require('../middleware/auth');
const { validateFile } = require('../middleware/upload');
const { validateObjectId } = require('../middleware/validation');

// Upload asset (protected)
router.post('/upload', auth, validateFile, assetController.uploadAsset);

// Get user assets (protected)
router.get('/', auth, assetController.getUserAssets);

// Get public assets
router.get('/public', assetController.getPublicAssets);

// Delete asset (protected)
router.delete('/:id', auth, validateObjectId, assetController.deleteAsset);

module.exports = router;