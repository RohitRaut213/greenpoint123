const express = require('express');
const { submitAction, getUserActions, uploadImage } = require('../controllers/actionController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, submitAction);
router.get('/', auth, getUserActions);

// Image upload endpoint (no auth required for camera capture)
router.post('/upload', uploadImage);

module.exports = router;
