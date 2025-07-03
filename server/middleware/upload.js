

// Simple file validation
exports.validateFile = (req, res, next) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded"
    });
  }

  const file = req.files.file;
  const { type } = req.body;

  if (!type) {
    return res.status(400).json({
      success: false,
      message: "Asset type is required"
    });
  }

  // Check file type based on asset type
  const allowedTypes = {
    'sprite': ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    'sound': ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'],
    'background': ['image/jpeg', 'image/jpg', 'image/png']
  };

  if (!allowedTypes[type]) {
    return res.status(400).json({
      success: false,
      message: "Invalid asset type. Must be: sprite, sound, or background"
    });
  }

  if (!allowedTypes[type].includes(file.mimetype)) {
    return res.status(400).json({
      success: false,
      message: `Invalid file type for ${type}. Allowed: ${allowedTypes[type].join(', ')}`
    });
  }

  // Check file size (50MB limit)
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    return res.status(400).json({
      success: false,
      message: "File too large. Maximum size is 50MB"
    });
  }

  next();
};