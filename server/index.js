const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const connectDB = require('./config/database');
const resetArrays = require('./utils/resetArrays'); // ✅ Fixed import
require('dotenv').config();

const app = express();

// Connect to database
connectDB();

// ✅ AUTO-RESET IN DEVELOPMENT (Fixed function call)
if (process.env.NODE_ENV !== 'production') {
  console.log('🔄 Development mode - will sync user arrays after DB connection...');
  setTimeout(async () => {
    try {
      const success = await resetArrays(); // ✅ Correct function name
      if (success) {
        console.log('✅ User arrays synchronized');
      } else {
        console.log('⚠️ Array sync skipped');
      }
    } catch (error) {
      console.log('⚠️ Array sync failed:', error.message);
    }
  }, 3000); // Wait 3 seconds for DB connection
}

// Basic middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// File upload
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// Serve static files
app.use('/uploads', express.static('uploads'));

// Routes
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/games');
const userRoutes = require('./routes/users');
const assetRoutes = require('./routes/assets');
const templateRoutes = require('./routes/templates');

app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/templates', templateRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Database: ${process.env.MONGODB_URI ? 'Configured' : 'No URI found'}`);
});

module.exports = app;