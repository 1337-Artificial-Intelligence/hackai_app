require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const csv = require('csv-parser');

async function creatementorsFromCSV() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB URI:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Read and parse CSV file
    const mentors = [];
    
    await new Promise((resolve, reject) => {
      fs.createReadStream('mentors.csv')
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

    // Clear existing mentors (optional - remove this if you want to keep existing mentors)
    // await mongoose.connection.collection('mentors').deleteMany({});
    // console.log('Cleared existing mentors');


    // Create mentors in database
    const createdMentors = [];
    
    for (const mentor of mentors) {
      try {
        // Generate a unique 5-character password for each mentor
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mentor.mentorPassword, salt);

        const mentorDoc = {
          teamName: mentor.mentorName,
          password: hashedPassword,
          role: 'mentor', // Default role for mentors
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = await mongoose.connection.collection('teams').insertOne(mentorDoc);
        
        createdMentors.push({
          id: result.insertedId,
          mentorName: mentor.mentorName,
          password: mentor.mentorPassword // Store the plain password for display
        });
      } catch (error) {
        console.error(`Error creating mentor ${mentor.mentorName}:`, error.message);
      }
    }

    console.log('\n=== SUMMARY ===');
    console.log(`Successfully created ${createdMentors.length} mentors:`);
    createdMentors.forEach(mentor => {
      console.log(`${mentor.mentorName},${mentor.password}`);
    });

    console.log('\nIMPORTANT: Save these passwords! Each mentor has a unique 5-character password.');

  } catch (error) {
    console.error('Error creating mentors from CSV:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

creatementorsFromCSV();