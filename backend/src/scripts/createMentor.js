require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

async function creatementorsFromCSV() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB URI:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Read and parse CSV file
    const mentors = [];
    
    // Get CSV path from environment variable or use default path
    const csvPath = process.env.MENTORS_CSV_PATH || path.join(__dirname, 'mentors.csv');
    console.log(`Reading mentors from: ${csvPath}`);
    
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          // Extract mentor data from CSV row
          const mentorName = row['Mentor Username']?.trim().toLowerCase();
          const mentorPassword = row['Mentor Password']?.trim();

          if (mentorName) {
            mentors.push({
              mentorName,
              mentorPassword,
            });
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`Found ${mentors.length} mentors in CSV file`);

    // We are updating existing mentors with new passwords
    console.log('Updating existing mentors with new passwords');


    // Update mentors in database
    const updatedMentors = [];
    
    for (const mentor of mentors) {
      try {
        // Generate a unique password hash for each mentor
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mentor.mentorPassword, salt);

        // Update existing mentor with new password
        const result = await mongoose.connection.collection('teams').updateOne(
          { teamName: mentor.mentorName },
          { 
            $set: {
              password: hashedPassword,
              updatedAt: new Date()
            }
          }
        );
        
        if (result.matchedCount > 0) {
          updatedMentors.push({
            mentorName: mentor.mentorName,
            password: mentor.mentorPassword // Store the plain password for display
          });
        } else {
          console.log(`No mentor found with username: ${mentor.mentorName}`);
        }
      } catch (error) {
        console.error(`Error creating mentor ${mentor.mentorName}:`, error.message);
      }
    }

    console.log('\n=== SUMMARY ===');
    console.log(`Successfully updated ${updatedMentors.length} mentors:`);
    updatedMentors.forEach(mentor => {
      console.log(`${mentor.mentorName},${mentor.password}`);
    });

    console.log('\nIMPORTANT: Save these new passwords! Make sure to distribute them to the mentors.');

  } catch (error) {
    console.error('Error creating mentors from CSV:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

creatementorsFromCSV();