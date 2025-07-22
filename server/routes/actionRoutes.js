const express = require('express');
const { submitAction, getUserActions } = require('../controllers/actionController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, submitAction);
router.get('/', auth, getUserActions);

module.exports = router;
