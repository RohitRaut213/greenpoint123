const EcoAction = require('../models/EcoAction');

exports.submitAction = async (req, res) => {
    try {
        const { title, description, points } = req.body;
        const userId = req.user.id;

        const action = await EcoAction.create({ title, description, points, userId });
        res.status(201).json(action);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserActions = async (req, res) => {
    try {
        const userId = req.user.id;
        const actions = await EcoAction.find({ userId });
        res.json(actions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
