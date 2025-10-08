const EcoAction = require('../models/EcoAction');
const fs = require('fs');
const path = require('path');

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

// Image upload for camera capture
exports.uploadImage = async (req, res) => {
    try {
        const { image, actionType, userId } = req.body;

        // Basic validation
        if (!image || !actionType || !userId) {
            return res.status(400).json({ error: 'Missing required fields: image, actionType, userId' });
        }

        // Validate image format (basic check for base64)
        if (!image.startsWith('data:image/')) {
            return res.status(400).json({ error: 'Invalid image format' });
        }

        // For now, we'll just return success and a placeholder URL
        // In a real app, you'd save the image to cloud storage (AWS S3, Cloudinary, etc.)
        const imageUrl = `https://via.placeholder.com/400x300?text=${actionType.toUpperCase()}+Photo`;

        console.log(`Image uploaded for user ${userId}, action type: ${actionType}`);

        res.json({
            success: true,
            url: imageUrl,
            message: 'Image uploaded successfully'
        });

    } catch (err) {
        console.error('Image upload error:', err);
        res.status(500).json({
            error: 'Failed to upload image',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};
