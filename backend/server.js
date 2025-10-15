import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import propertyRoutes from './routes/propertyRoutes.js';
import wantedAdRoutes from './routes/wantedAdRoutes.js';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // These options are no longer needed in Mongoose 6+
      // but keeping for reference
    });
    console.log('✅ MongoDB Atlas Connected Successfully!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    // Don't exit - allow server to run even if DB connection fails
    console.log('⚠️  Server running without database connection');
  }
};

// Connect to Database
connectDB();

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Corphaus API is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/wanted-ads', wantedAdRoutes);
app.use('/api/messages', messageRoutes);

// Test route
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Corphaus API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login',
        getMe: 'GET /api/auth/me (auth required)',
        upgrade: 'POST /api/auth/upgrade (auth required)'
      },
      properties: {
        getAll: 'GET /api/properties',
        getById: 'GET /api/properties/:id',
        getMy: 'GET /api/properties/my/listings (auth required)',
        create: 'POST /api/properties (auth required)',
        update: 'PUT /api/properties/:id (auth required)',
        delete: 'DELETE /api/properties/:id (auth required)'
      },
      wantedAds: {
        getAll: 'GET /api/wanted-ads',
        getById: 'GET /api/wanted-ads/:id',
        getMy: 'GET /api/wanted-ads/my/listings (auth required)',
        create: 'POST /api/wanted-ads (auth required)',
        update: 'PUT /api/wanted-ads/:id (auth required)',
        delete: 'DELETE /api/wanted-ads/:id (auth required)'
      },
      messages: {
        send: 'POST /api/messages (auth required)',
        conversations: 'GET /api/messages/conversations (auth required)',
        thread: 'GET /api/messages/thread/:threadId (auth required)',
        markRead: 'PUT /api/messages/read/:threadId (auth required)',
        unreadCount: 'GET /api/messages/unread-count (auth required)',
        delete: 'DELETE /api/messages/:messageId (auth required)'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`💡 Frontend should continue using mock data for now`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('✅ Database connection closed');
  process.exit(0);
});

