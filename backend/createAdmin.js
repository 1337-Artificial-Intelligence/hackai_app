const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/thinkai');
    console.log('Connected to MongoDB');

    // First, delete any existing admin
    await mongoose.connection.collection('teams').deleteOne({ teamName: 'admin' });
    console.log('Deleted existing admin if any');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
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
