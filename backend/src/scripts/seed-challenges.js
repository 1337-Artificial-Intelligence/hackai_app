// Load environment variables from root .env file
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Challenge = require('../models/challenge.model');
const { challengeData, challengeIds } = require('../data/challenges');

const seedChallenges = async () => {
  try {
    // Connect to MongoDB with fallback URI
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/thinkai';
    console.log('Connecting to MongoDB URI:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing challenges
    await Challenge.deleteMany({});
    console.log('Cleared existing challenges');

    // First pass: Create challenges without dependencies
    for (const challenge of challengeData) {
      const { id, dependencies, ...challengeInfo } = challenge;
      const newChallenge = await Challenge.create(challengeInfo);
      challengeIds[id] = newChallenge._id;
    }
    console.log('Created challenges');

    // Second pass: Update dependencies
    for (const challenge of challengeData) {
      if (challenge.dependencies.length > 0) {
        const dependencyIds = challenge.dependencies.map(depId => challengeIds[depId]);
        await Challenge.findByIdAndUpdate(
          challengeIds[challenge.id],
          { dependencies: dependencyIds }
        );
      }
    }
    console.log('Updated challenge dependencies');

    console.log('Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding challenges:', error);
    process.exit(1);
  }
};

seedChallenges();
