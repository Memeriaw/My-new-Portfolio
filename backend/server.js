require('dotenv').config();
const express = require('express');
const { UPLOAD_DIR } = require('./src/utils/uploadStorage');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB, isMongoActive } = require('./src/config/db');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');

// Route Handlers
const authRoutes = require('./src/routes/authRoutes');
const projectRoutes = require('./src/routes/projectRoutes');
const contactRoutes = require('./src/routes/contactRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database (MongoDB or local JSON fallback)
connectDB();

// Security HTTP Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// Cross-Origin Resource Sharing
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev to avoid CORS blocking
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(UPLOAD_DIR, { fallthrough: false, maxAge: '1d' }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'Memeriaw Adugnaw Portfolio API',
    database: isMongoActive() ? 'MongoDB' : 'Local Persistent JSON Store',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Start HTTP Server
const server = app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 Memeriaw Portfolio Backend REST API RUNNING!`);
  console.log(`🌐 Server Port:     http://localhost:${PORT}`);
  console.log(`⚡ Health Check:    http://localhost:${PORT}/api/health`);
  console.log(`📂 Public Projects: http://localhost:${PORT}/api/projects`);
  console.log(`👤 Profile Data:    http://localhost:${PORT}/api/profile`);
  console.log(`📬 Contact API:     http://localhost:${PORT}/api/contact (POST)`);
  console.log(`🛡️  Admin Portal:    http://localhost:${PORT}/api/admin/...`);
  console.log('====================================================');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});

module.exports = app;
