const mongoose = require('mongoose');
require('dotenv').config();

const seedAll = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    console.log('1. Seeding Game Templates...');
    // Direct require and call
    require('./gameTemplates');
    
    console.log('2. Seeding Users...');
    // Direct require and call
    require('./users');
    
    console.log('3. Seeding Games...');
    // Direct require and call  
    require('./games');

    console.log('\n✅ All seeds completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedAll();
}

module.exports = { seedAll };