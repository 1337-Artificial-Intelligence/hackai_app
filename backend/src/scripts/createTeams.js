require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

async function createTeamsFromCSV() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB URI:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Read and parse CSV file
    const teams = [];
    
    // Get CSV path from environment variable or use default path
    const csvPath = process.env.TEAMS_CSV_PATH || path.join(__dirname, 'teams.csv');
    console.log(`Reading teams from: ${csvPath}`);
    
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
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

    // We are updating existing teams with new passwords
    console.log('Updating existing teams with new passwords');

    // Function to generate random 5-character password with lowercase letters and numbers
    function generatePassword() {
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let password = '';
      for (let i = 0; i < 5; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    }

    // Update teams in database
    const updatedTeams = [];
    
    for (const team of teams) {
      try {
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(team.teamPassword, salt);

        // Update existing team with new password
        const result = await mongoose.connection.collection('teams').updateOne(
          { teamName: team.teamName },
          { 
            $set: {
              password: hashedPassword,
              updatedAt: new Date()
            }
          }
        );
        
        if (result.matchedCount > 0) {
          updatedTeams.push({
            teamName: team.teamName,
            members: team.members,
            memberCount: team.members.length,
            password: team.teamPassword // Store the plain password for display
          });
        } else {
          console.log(`No team found with name: ${team.teamName}`);
        }
      } catch (error) {
        console.error(`Error creating team ${team.teamName}:`, error.message);
      }
    }

    console.log('\n=== SUMMARY ===');
    console.log(`Successfully updated ${updatedTeams.length} teams:`);
    updatedTeams.forEach(team => {
      console.log(`${team.teamName},${team.password},${team.members.join(' | ')}`);
    });

    console.log('\nIMPORTANT: Save these new passwords! Make sure to distribute them to the teams.');

  } catch (error) {
    console.error('Error creating teams from CSV:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createTeamsFromCSV();