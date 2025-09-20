const mongoose = require('mongoose');

const ecoActionSchema = new mongoose.Schema({
    clerkId: { type: String, index: true }, // Clerk user ID (optional)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional: local User reference
    title: String,
    description: String,
    points: Number,
    imageUrl: String, // Cloudinary URL
    actionType: String, // 'tree' or 'transport'
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EcoAction', ecoActionSchema);
