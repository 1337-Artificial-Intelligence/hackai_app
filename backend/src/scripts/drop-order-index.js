require('dotenv').config();
const mongoose = require('mongoose');

const dropOrderIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Drop the order index from challenges collection
    await mongoose.connection.db.collection('challenges').dropIndex('order_1');
    console.log('Successfully dropped order_1 index');

    process.exit(0);
  } catch (error) {
    console.error('Error dropping index:', error);
    process.exit(1);
  }
};

dropOrderIndex();
