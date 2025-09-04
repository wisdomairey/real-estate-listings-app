import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/propertyhub');
    console.log('📊 MongoDB Connected for admin creation');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create admin user
const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@propertyhub.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('📧 Email: admin@propertyhub.com');
      console.log('🔑 Password: admin123');
      return;
    }

    // Create new admin user
    const adminUser = new User({
      email: 'admin@propertyhub.com',
      password: 'admin123',
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      phone: '15550000000',
      isActive: true,
      isEmailVerified: true
    });

    await adminUser.save();
    
    console.log('🎉 Admin user created successfully!');
    console.log('📧 Email: admin@propertyhub.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

// Run the script
const runScript = async () => {
  await connectDB();
  await createAdminUser();
  await mongoose.connection.close();
  console.log('📊 Database connection closed');
  process.exit(0);
};

// Check if this file is being run directly
if (process.argv[1].includes('createAdmin.js')) {
  runScript();
}

export { createAdminUser };
