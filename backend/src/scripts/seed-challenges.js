require('dotenv').config();
const mongoose = require('mongoose');
const Challenge = require('../models/challenge.model');
const challenges = require('../data/challenges');

const seedChallenges = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing challenges
    await Challenge.deleteMany({});
    console.log('Cleared existing challenges');

    // Insert new challenges
    await Challenge.insertMany(challenges);
    console.log('Added new challenges');

    console.log('Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedChallenges();
