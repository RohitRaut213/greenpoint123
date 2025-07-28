const Feedback = require('../models/Feedback');

// POST /api/feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { email, message } = req.body;
    if (!email || !message) {
      return res.status(400).json({ error: 'Email and message are required.' });
    }
    const feedback = await Feedback.create({ email, message });
    res.status(201).json({ success: true, feedback });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
