require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const csv = require('csv-parser');

async function createTeamsFromCSV() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB URI:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Read and parse CSV file
    const teams = [];
    
    await new Promise((resolve, reject) => {
      fs.createReadStream('teams.csv')
        .pipe(csv())
        .on('data', (row) => {
          // Extract team data from CSV row
          const teamName = row['Team Name']?.trim().toLowerCase();
          const members = row['Team Members']?.trim();
          const teamPassword = row['Team Password']?.trim();

          if (teamName) {
            const teamMembers = members.split("|").map(member => member.trim());

            teams.push({
              teamName,
              members: teamMembers,
              teamPassword
            });
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`Found ${teams.length} teams in CSV file`);

    // Clear existing teams (optional - remove this if you want to keep existing teams)
    // await mongoose.connection.collection('teams').deleteMany({});
    // console.log('Cleared existing teams');

    // Function to generate random 5-character password with lowercase letters and numbers
    function generatePassword() {
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let password = '';
      for (let i = 0; i < 5; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    }

    // Create teams in database
    const createdTeams = [];
    
    for (const team of teams) {
      try {
        // Generate a unique 5-character password for each team
        // const teamPassword = generatePassword();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(team.teamPassword, salt);

        const teamDoc = {
          teamName: team.teamName,
          password: hashedPassword,
          members: team.members,
          role: 'team', // Default role for teams
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = await mongoose.connection.collection('teams').insertOne(teamDoc);
        
        createdTeams.push({
          id: result.insertedId,
          teamName: team.teamName,
          members: team.members,
          memberCount: team.members.length,
          password: team.teamPassword // Store the plain password for display
        });
      } catch (error) {
        console.error(`Error creating team ${team.teamName}:`, error.message);
      }
    }

    console.log('\n=== SUMMARY ===');
    console.log(`Successfully created ${createdTeams.length} teams:`);
    createdTeams.forEach(team => {
      console.log(`${team.teamName},${team.password},${team.members.join(' | ')}`);
    });

    console.log('\nIMPORTANT: Save these passwords! Each team has a unique 5-character password.');

  } catch (error) {
    console.error('Error creating teams from CSV:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createTeamsFromCSV();