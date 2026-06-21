import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

/**
 * Connect to MongoDB Database and seed default admin if not present
 */
export async function connectDB() {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/event_feedback';
    const conn = await mongoose.connect(connStr);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Seed default admin account if none exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      });
      await adminUser.save();
      console.log('Seeded default admin user: admin@example.com / AdminPassword123!');
    }
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
}

