const Reward = require('../models/Reward');

exports.getAllRewards = async (req, res) => {
    try {
        const rewards = await Reward.find();
        res.json(rewards);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createReward = async (req, res) => {
    try {
        const reward = await Reward.create(req.body);
        res.status(201).json(reward);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
