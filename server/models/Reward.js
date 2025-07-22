const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
    title: String,
    description: String,
    cost: Number,
    imageUrl: String,
});

module.exports = mongoose.model('Reward', rewardSchema);
