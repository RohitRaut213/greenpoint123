const express = require('express');
const { syncClerkUser } = require('../controllers/clerkUserController');
const router = express.Router();

// POST /api/clerk/sync-user
router.post('/sync-user', syncClerkUser);

module.exports = router;
