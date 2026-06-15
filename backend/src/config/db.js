import mongoose from 'mongoose';

/**
 * Connect to MongoDB Database
 */
export async function connectDB() {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/event_feedback';
    const conn = await mongoose.connect(connStr);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
}
