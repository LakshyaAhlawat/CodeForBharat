const mongoose = require('mongoose');

const gameTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['platformer', 'runner', 'flappy', 'shooter'] },
  
  // Default configuration for this template
  defaultConfig: {
    type: Object,
    required: true
  },
  
  thumbnail: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('GameTemplate', gameTemplateSchema);