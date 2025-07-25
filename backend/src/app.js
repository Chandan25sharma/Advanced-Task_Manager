const express = require('express');
const cors = require('cors');
const path = require('path');

// Routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');

// Middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

const createApp = () => {
  const app = express();

  // CORS configuration
  const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map(origin => origin.trim());

app.use(cors({
  origin: function (origin, callback) {
    // Allow no-origin requests (e.g., from Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('❌ Not allowed by CORS'));
    }
  },
  credentials: true
}));


  // Request logging middleware
  app.use((req, res, next) => {
    console.log(`📡 ${req.method} ${req.path}`, {
      origin: req.get('Origin') || 'No origin',
      userAgent: req.get('User-Agent')?.substring(0, 50) || 'Unknown'
    });
    next();
  });

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Static files (for file uploads)
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV 
    });
  });

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/tasks', taskRoutes);

  // 404 handler
  app.use(notFound);

  // Error handler
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
