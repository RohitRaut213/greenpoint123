const Reward = require('../models/Reward');
const nodemailer = require('nodemailer');

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

// Coupon redemption functionality
exports.redeemCoupon = async (req, res) => {
    try {
        const { userId, couponId, couponCode, userEmail, pointsSpent } = req.body;

        // Here you would typically:
        // 1. Validate the coupon exists and is available
        // 2. Check if user has enough points
        // 3. Deduct points from user's account
        // 4. Mark coupon as redeemed
        // 5. Track the redemption in database

        // For now, we'll simulate success
        console.log(`Coupon redeemed: ${couponCode} for user ${userEmail}`);

        res.json({
            success: true,
            message: 'Coupon redeemed successfully',
            couponCode,
            pointsSpent
        });

    } catch (err) {
        console.error('Redemption error:', err);
        res.status(500).json({ error: 'Failed to redeem coupon' });
    }
};

// Email notification for coupon redemption (optional)
exports.sendCouponEmail = async (req, res) => {
    try {
        const { email, couponCode, brand, description } = req.body;

        // Check if email credentials are configured
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('Email credentials not configured - skipping email send');
            return res.json({
                success: true,
                message: 'Coupon redeemed successfully (email not sent - credentials not configured)'
            });
        }

        // Configure email transporter (using Gmail as example)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `🎁 Your ${brand} Coupon Code - EcoMetrics`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="margin: 0;">🎁 Coupon Redeemed!</h1>
                    </div>

                    <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #4CAF50; text-align: center;">Congratulations! 🌟</h2>

                        <p style="font-size: 16px; line-height: 1.6;">
                            You've successfully redeemed a <strong>${brand}</strong> coupon using your EcoMetrics green points!
                        </p>

                        <div style="background-color: #f0f8ff; padding: 20px; border-left: 4px solid #4CAF50; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #4CAF50;">Your Coupon Details:</h3>
                            <p><strong>Brand:</strong> ${brand}</p>
                            <p><strong>Description:</strong> ${description}</p>
                            <p><strong>Coupon Code:</strong> <span style="font-size: 18px; font-weight: bold; color: #4CAF50; background-color: #f0f0f0; padding: 5px 10px; border-radius: 5px;">${couponCode}</span></p>
                        </div>

                        <p style="font-size: 16px; line-height: 1.6;">
                            Thank you for contributing to a greener planet! Your eco-friendly actions are making a real difference.
                        </p>

                        <div style="text-align: center; margin-top: 30px;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard"
                               style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                Continue Earning Points
                            </a>
                        </div>

                        <p style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
                            This email was sent by EcoMetrics - Track your carbon footprint and earn rewards!
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Coupon email sent to ${email}`);

        res.json({
            success: true,
            message: 'Coupon email sent successfully'
        });

    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({
            error: 'Failed to send coupon email',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
