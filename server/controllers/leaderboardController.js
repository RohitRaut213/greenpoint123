const User = require('../models/User');

// GET /api/leaderboard
// Returns array of users sorted by points (desc), only name and points fields
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({}, 'name points').sort({ points: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
