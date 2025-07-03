const sharp = require('sharp');
const cloudinary = require('../config/cloudinary');

// Process and optimize image
const processImage = async (buffer, options = {}) => {
  try {
    const {
      width = 800,
      height = 600,
      quality = 80,
      format = 'webp'
    } = options;

    const processed = await sharp(buffer)
      .resize(width, height, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .webp({ quality })
      .toBuffer();

    return processed;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

// Generate thumbnail from image
const generateThumbnail = async (buffer, size = 200) => {
  try {
    const thumbnail = await sharp(buffer)
      .resize(size, size, { 
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 70 })
      .toBuffer();

    return thumbnail;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    throw error;
  }
};

// Upload to cloudinary
const uploadToCloudinary = async (buffer, options = {}) => {
  try {
    const {
      folder = 'codetogame',
      resourceType = 'auto',
      format,
      transformation
    } = options;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          format,
          transformation
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error('Error uploading to cloudinary:', error);
    throw error;
  }
};

// Process sprite sheet
const processSpriteSheet = async (buffer, frameWidth, frameHeight) => {
  try {
    const metadata = await sharp(buffer).metadata();
    const { width, height } = metadata;

    const framesX = Math.floor(width / frameWidth);
    const framesY = Math.floor(height / frameHeight);
    const totalFrames = framesX * framesY;

    // Optimize the sprite sheet
    const optimized = await sharp(buffer)
      .webp({ quality: 90 })
      .toBuffer();

    return {
      optimizedBuffer: optimized,
      metadata: {
        totalFrames,
        framesX,
        framesY,
        frameWidth,
        frameHeight,
        originalWidth: width,
        originalHeight: height
      }
    };
  } catch (error) {
    console.error('Error processing sprite sheet:', error);
    throw error;
  }
};

// Validate image dimensions
const validateImageDimensions = (metadata, maxWidth = 2048, maxHeight = 2048) => {
  const { width, height } = metadata;
  
  if (width > maxWidth || height > maxHeight) {
    throw new Error(`Image dimensions too large. Maximum: ${maxWidth}x${maxHeight}, Got: ${width}x${height}`);
  }

  return true;
};

// Get image metadata
const getImageMetadata = async (buffer) => {
  try {
    const metadata = await sharp(buffer).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: metadata.size,
      channels: metadata.channels,
      hasAlpha: metadata.hasAlpha
    };
  } catch (error) {
    console.error('Error getting image metadata:', error);
    throw error;
  }
};

// Process audio file (basic validation)
const processAudio = async (buffer, originalName) => {
  try {
    // Basic audio validation
    const allowedFormats = ['.mp3', '.wav', '.ogg', '.m4a'];
    const extension = originalName.toLowerCase().substring(originalName.lastIndexOf('.'));
    
    if (!allowedFormats.includes(extension)) {
      throw new Error(`Unsupported audio format: ${extension}`);
    }

    // Check file size (max 10MB for audio)
    const maxSize = 10 * 1024 * 1024;
    if (buffer.length > maxSize) {
      throw new Error('Audio file too large. Maximum size: 10MB');
    }

    return {
      buffer,
      extension,
      size: buffer.length
    };
  } catch (error) {
    console.error('Error processing audio:', error);
    throw error;
  }
};

// Batch process multiple assets
const batchProcessAssets = async (files, userId) => {
  try {
    const results = [];

    for (const file of files) {
      const { type, buffer, originalName } = file;
      
      let processed;
      
      if (type === 'sprite' || type === 'background') {
        // Process image
        const metadata = await getImageMetadata(buffer);
        validateImageDimensions(metadata);
        
        const optimized = await processImage(buffer, {
          width: type === 'background' ? 1920 : 512,
          height: type === 'background' ? 1080 : 512
        });
        
        const thumbnail = await generateThumbnail(buffer);
        
        processed = {
          optimized,
          thumbnail,
          metadata
        };
      } else if (type === 'sound') {
        // Process audio
        processed = await processAudio(buffer, originalName);
      }

      results.push({
        originalName,
        type,
        processed,
        userId
      });
    }

    return results;
  } catch (error) {
    console.error('Error in batch processing:', error);
    throw error;
  }
};

module.exports = {
  processImage,
  generateThumbnail,
  uploadToCloudinary,
  processSpriteSheet,
  validateImageDimensions,
  getImageMetadata,
  processAudio,
  batchProcessAssets
};