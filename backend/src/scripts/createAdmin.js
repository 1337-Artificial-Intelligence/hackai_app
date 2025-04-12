require('dotenv').config();
const mongoose = require('mongoose');
const Team = require('../models/team.model');

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminData = {
      teamName: 'admin',
      members: [{ name: 'Admin User' }],
      password: 'admin123', // This will be hashed automatically by the model
      role: 'admin',
      isActive: true
    };

    // Check if admin already exists
    const existingAdmin = await Team.findOne({ teamName: adminData.teamName });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = await Team.create(adminData);
    console.log('Admin user created successfully:', admin.teamName);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdminUser();
