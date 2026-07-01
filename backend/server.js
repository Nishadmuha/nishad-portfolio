import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

// Import Database connection manager
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Set up public static uploads route
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Route definitions
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api', settingRoutes);
app.use('/api/upload', uploadRoutes);

// Database connection & Auto-seeding setup (executed inside startServer)

// Seed data from local database.json if MongoDB collections are empty
async function autoSeedDatabase() {
  try {
    const dbPath = path.join(__dirname, 'database.json');
    if (!fs.existsSync(dbPath)) return;
    
    const rawData = fs.readFileSync(dbPath, 'utf8');
    const data = JSON.parse(rawData);
    
    // 1. Seed Admin
    // Clean up any legacy admin documents that have 'password' instead of 'passwordHash'
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
      // Map JSON IDs (strings/numbers) to mongoose records (skip local id strings if we let mongo autogenerate)
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

// Start Server after database connection
const startServer = async () => {
  try {
    await connectDB();
    await autoSeedDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
