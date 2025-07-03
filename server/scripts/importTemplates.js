// scripts/importTemplates.js
const mongoose = require('mongoose');
const GameTemplate = require('../models/GameTemplate');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const importTemplates = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing templates
    await GameTemplate.deleteMany({});
    console.log('🗑️ Cleared existing templates');

    // Read template files from your templates folder
    const templatesDir = path.join(__dirname, '../templates');
    const templateFiles = ['platformer.json', 'runner.json', 'flappy.json', 'shooter.json'];

    const templates = [];

    for (const file of templateFiles) {
      const filePath = path.join(templatesDir, file);
      
      if (fs.existsSync(filePath)) {
        const templateData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        templates.push(templateData);
        console.log(`📁 Loaded template: ${templateData.displayName}`);
      } else {
        console.log(`⚠️ Template file not found: ${file}`);
      }
    }

    // Insert templates into database
    if (templates.length > 0) {
      await GameTemplate.insertMany(templates);
      console.log(`✅ Successfully imported ${templates.length} templates:`);
      templates.forEach(template => {
        console.log(`   - ${template.displayName} (${template.type})`);
      });
    }

    console.log('🎮 Template import completed!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
};

importTemplates();