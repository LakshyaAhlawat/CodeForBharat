const Asset = require('../models/Asset');
const cloudinary = require('../config/cloudinary');

// Upload asset
exports.uploadAsset = async (req, res) => {
  try {
    console.log('📁 Upload started by user:', req.user.id);
    
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const file = req.files.file;
    const { name } = req.body;
    let { type } = req.body;

    console.log('📄 File details:', {
      name: file.name,
      mimetype: file.mimetype,
      size: file.size,
      providedType: type
    });

    // Auto-detect type if not provided
    if (!type) {
      if (file.mimetype.startsWith('image/')) {
        type = 'sprite';
      } else if (file.mimetype.startsWith('audio/')) {
        type = 'sound';
      } else {
        type = 'background';
      }
    }

    // Validate type
    const validTypes = ['sprite', 'sound', 'background', 'image', 'audio'];
    if (!validTypes.includes(type.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid asset type. Must be: ${validTypes.join(', ')}`
      });
    }

    console.log('☁️ Uploading to Cloudinary...');
    
    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'codetogame/assets',
      resource_type: 'auto'
    });

    console.log('✅ Cloudinary upload successful:', result.secure_url);

    // Create asset record
    const assetData = {
      name: name || file.name,
      type: type.toLowerCase(),
      url: result.secure_url,
      owner: req.user.id,
      size: file.size
    };

    console.log('💾 Saving asset to database:', assetData);

    const asset = new Asset(assetData);
    await asset.save();

    console.log('✅ Asset saved with ID:', asset._id);

    res.status(201).json({
      success: true,
      message: 'Asset uploaded successfully',
      asset
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user assets
exports.getUserAssets = async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    
    console.log('🔍 Getting assets for user:', req.user.id);
    console.log('🔍 Query params:', { type, page, limit });
    
    const filter = { owner: req.user.id };
    if (type) filter.type = type;

    console.log('🔍 Filter used:', filter);

    const assets = await Asset.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Asset.countDocuments(filter);

    console.log('✅ Found assets:', assets.length, 'Total:', total);

    res.json({
      success: true,
      assets,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalAssets: total // ✅ Add total count
    });
  } catch (error) {
    console.error('❌ Get assets error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete asset
exports.deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    if (asset.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this asset'
      });
    }

    await Asset.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Asset deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get public assets
exports.getPublicAssets = async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    
    const filter = { isPublic: true };
    if (type) filter.type = type;

    const assets = await Asset.find(filter)
      .populate('owner', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      assets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};