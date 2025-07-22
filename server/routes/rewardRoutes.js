const express = require('express');
const { getAllRewards, createReward } = require('../controllers/rewardController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', getAllRewards);
router.post('/', auth, createReward);

module.exports = router;
