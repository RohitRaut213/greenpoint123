const express = require('express');
const { getAllRewards, createReward, redeemCoupon, sendCouponEmail } = require('../controllers/rewardController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', getAllRewards);
router.post('/', auth, createReward);

// Coupon redemption endpoints
router.post('/redeem-coupon', redeemCoupon);
router.post('/send-coupon-email', sendCouponEmail);

module.exports = router;
