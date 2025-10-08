const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const cloudinary = require('./cloudinary');

// Import routes
const userRoutes = require('./routes/userRoutes');
const actionRoutes = require('./routes/actionRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const clerkUserRoutes = require('./routes/clerkUserRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT || 3000;

// Connect routes
app.use('/api/users', userRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/clerk', clerkUserRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/feedback', feedbackRoutes);

app.get("/", (req, res) => {
  res.send("EcoMetrics API is working!");
});

// Image upload endpoint
const EcoAction = require('./models/EcoAction');
app.post('/api/upload', async (req, res) => {
  try {
    const { image, actionType, userId, clerkId, title, description } = req.body;
    if (!image) return res.status(400).json({ error: 'No image provided' });
    
    // Assign points based on action type
    let points = 0;
    if (actionType === 'tree') points = 10;
    else if (actionType === 'transport') points = 5;
    
    const uploadRes = await cloudinary.uploader.upload(image, {
      folder: 'eco_actions',
      public_id: `${actionType || 'action'}_${userId || 'unknown'}_${Date.now()}`
    });
    
    // Save to MongoDB
    const ecoAction = await EcoAction.create({
      clerkId: clerkId || '',
      title: title || '',
      description: description || '',
      points,
      imageUrl: uploadRes.secure_url,
      actionType: actionType || '',
    });
    
    // Update user's total points (only if user exists)
    const User = require('./models/User');
    if (clerkId) {
      console.log('Updating points for clerkId:', clerkId, 'points:', points);
      try {
        const existingUser = await User.findOne({ clerkId });
        if (existingUser) {
          existingUser.points += points;
          await existingUser.save();
          console.log('User points updated:', existingUser.points);
        } else {
          console.log('User not found in database, skipping points update');
          // Optionally create a minimal user record
          // await User.create({
          //   clerkId,
          //   name: 'Unknown User',
          //   email: 'unknown@example.com',
          //   points
          // });
        }
      } catch (err) {
        console.error('Error updating user points:', err.message);
      }
    } else {
      console.log('No clerkId provided, skipping points update');
    }
    
    return res.json({ 
      url: uploadRes.secure_url, 
      ecoAction,
      pointsAwarded: points
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Image upload failed' });
  }
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
