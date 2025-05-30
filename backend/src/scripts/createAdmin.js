require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Default admin password for development only - should be overridden by environment variable
const DEFAULT_ADMIN_PASSWORD = 'development_password_only';

async function createAdmin() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB URI:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // First, delete any existing admin
    await mongoose.connection.collection('teams').deleteOne({ teamName: 'admin' });
    console.log('Deleted existing admin if any');

    // Get admin password from environment variable or use default (for development only)
    const adminPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    console.log('Generated hashed password');

    // Create admin user directly in MongoDB to bypass any model validation
    const admin = await mongoose.connection.collection('teams').insertOne({
      teamName: 'admin',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Admin user created:', {
      id: admin.insertedId,
      teamName: 'admin',
      role: 'admin',
      hashedPassword
    });
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createAdmin();
