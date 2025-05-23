require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const socketIO = require('socket.io');
const connectDB = require('./config/database');
const { protect } = require('./middleware/auth.middleware');

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Make io available globally
app.set('io', io);

// Test route before any middleware
app.get('/test', (req, res) => {
  res.json({ message: 'Basic test route working!' });
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins
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
app.use('/api/public', require('./routes/public.routes')); // Public routes - no auth required

// Error handling middleware
app.use(require('./middleware/error.middleware'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Join leaderboard room
  socket.on('join-leaderboard', () => {
    socket.join('leaderboard-room');
    console.log(`Client ${socket.id} joined leaderboard room`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT;
// const PORT = 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
