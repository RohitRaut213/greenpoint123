
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const actionRoutes = require('./routes/actionRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const clerkUserRoutes = require('./routes/clerkUserRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Connect routes
app.use('/api/users', userRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/clerk', clerkUserRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/feedback', feedbackRoutes);

app.get("/", (req, res) => {
  res.send("GreenPoint API is working!");
});

// Catch-all 404 route
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
const { errorHandler } = require('./middleware/errorHandler');
app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
