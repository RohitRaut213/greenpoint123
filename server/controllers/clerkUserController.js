const User = require('../models/User');

// Sync Clerk user to MongoDB
// Expects: { clerkId, email, name, points, co2saved }
exports.syncClerkUser = async (req, res) => {
  try {
    console.log('Received syncClerkUser request:', req.body);
    const { clerkId, email, name, points, co2saved } = req.body;
    if (!clerkId || !email || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Find or create user by clerkId
    let user = await User.findOne({ clerkId });
    if (!user) {
      user = await User.create({ clerkId, email, name, points: points || 0, co2saved: co2saved || 0 });
    } else {
      // Optionally update name/email/points/co2saved if changed
      user.email = email;
      user.name = name;
      if (typeof points === 'number') user.points = points;
      if (typeof co2saved === 'number') user.co2saved = co2saved;
      await user.save();
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error('syncClerkUser error:', err);
    res.status(500).json({ error: err.message });
  }
};
