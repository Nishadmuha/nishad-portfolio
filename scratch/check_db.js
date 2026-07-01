import mongoose from 'mongoose';
import Admin from '../backend/models/Admin.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../backend/.env' });

const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

async function check() {
  await mongoose.connect(URI);
  const admins = await Admin.find();
  console.log('Admins in DB:', JSON.stringify(admins, null, 2));
  await mongoose.disconnect();
}

check();
