require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/database');
const { protect } = require('./middleware/auth.middleware');

// Create Express app
const app = express();

// Test route before any middleware
app.get('/test', (req, res) => {
  res.json({ message: 'Basic test route working!' });
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow both ports
  credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

// Test route
app.get('/api', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/teams', protect, require('./routes/team.routes'));
app.use('/api/challenges', require('./routes/challenge.routes'));
app.use('/api/submissions', protect, require('./routes/submission.routes'));

// Error handling middleware
app.use(require('./middleware/error.middleware'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
