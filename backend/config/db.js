import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MongoDB Connection Error: MONGODB_URI is not defined.');
    process.exit(1);
  }

  // Setup connection event listeners
  mongoose.connection.on('connected', () => {
    console.log('✓ MongoDB connection status: Connected');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`❌ MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB connection status: Disconnected. Attempting to reconnect...');
  });

  try {
    const conn = await mongoose.connect(uri);
    return conn;
  } catch (error) {
    console.error(`❌ Critical: Failed to establish initial connection to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
