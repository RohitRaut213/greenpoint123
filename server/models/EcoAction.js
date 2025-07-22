const mongoose = require('mongoose');

const ecoActionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    description: String,
    points: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EcoAction', ecoActionSchema);
