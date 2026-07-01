import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

// Import environment validation and DB connection manager
import { validateEnv } from './config/env.js';
import connectDB from './config/db.js';

// Import Mongoose Models
import Admin from './models/Admin.js';
import Setting from './models/Setting.js';
import Project from './models/Project.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

// 1. Validate environment variables on startup
validateEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Production Security & Utility Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allows local uploads to be loaded cross-origin by the client
}));
app.use(compression());

// HTTP Request logging with morgan
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// 3. CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());

// Set up public static uploads route
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// 4. Rate Limiting (specifically for authentication endpoints)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: 'Too many login attempts from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Portfolio Backend API is running'
  });
});

// Route definitions
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api', settingRoutes);
app.use('/api/upload', uploadRoutes);

// 5. 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found - ${req.originalUrl}` });
});

// 6. Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Exception:', err);
  const statusCode = err.status || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {})
  });
});

// Seed data from local database.json if MongoDB collections are empty
async function autoSeedDatabase() {
  try {
    const dbPath = path.join(__dirname, 'database.json');
    if (!fs.existsSync(dbPath)) return;
    
    const rawData = fs.readFileSync(dbPath, 'utf8');
    const data = JSON.parse(rawData);
    
    // 1. Seed Admin
    await Admin.deleteMany({ passwordHash: { $exists: false } });
    
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0 && data.admin) {
      let passwordHash = data.admin.passwordHash;
      if (!passwordHash && data.admin.password) {
        passwordHash = bcrypt.hashSync(data.admin.password, 10);
      }
      if (passwordHash) {
        await Admin.create({
          username: data.admin.username || 'admin',
          passwordHash
        });
        console.log('MongoDB: Seeded admin account.');
      }
    }
    
    // 2. Seed Settings
    const settingsCount = await Setting.countDocuments();
    if (settingsCount === 0 && data.settings) {
      await Setting.create(data.settings);
      console.log('MongoDB: Seeded portfolio settings.');
    }
    
    // 3. Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0 && data.projects && data.projects.length > 0) {
      const mappedProjects = data.projects.map(p => ({
        name: p.name,
        year: p.year,
        category: p.category,
        image: p.image
      }));
      await Project.insertMany(mappedProjects);
      console.log(`MongoDB: Seeded ${mappedProjects.length} projects.`);
    }
    
  } catch (err) {
    console.error('Error during MongoDB auto-seeding:', err);
  }
}

// Start Server
let server;
const startServer = async () => {
  try {
    await connectDB();
    await autoSeedDatabase();
    server = app.listen(PORT, () => {
      console.log(`✓ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

// 7. Graceful Shutdown Handlers for SIGTERM and SIGINT (used by Render and Node process control)
const gracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(() => {
      console.log('✓ HTTP server closed.');
    });
  }
  try {
    await mongoose.connection.close(false);
    console.log('✓ MongoDB connection closed.');
    process.exit(0);
  } catch (err) {
    console.error(`❌ Error closing MongoDB connection: ${err.message}`);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
