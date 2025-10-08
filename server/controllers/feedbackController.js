const Feedback = require('../models/Feedback');
const nodemailer = require('nodemailer');

// POST /api/feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { email, message } = req.body;
    if (!email || !message) {
      return res.status(400).json({ error: 'Email and message are required.' });
    }

    // Save feedback to database
    const feedback = await Feedback.create({ email, message });

    // Send email notification to admin
    try {
      // Check if email credentials are configured
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Email credentials not configured - feedback saved but email not sent');
      } else {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: 'rautrohit1806@gmail.com', // Fixed the typo from # to @
          subject: `📧 New Feedback from EcoMetrics User`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                <h2 style="margin: 0;">📧 New Feedback Received</h2>
              </div>

              <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                <h3 style="color: #4CAF50;">Feedback Details:</h3>

                <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50;">
                  <p><strong>From:</strong> ${email}</p>
                  <p><strong>Message:</strong></p>
                  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border: 1px solid #dee2e6;">
                    ${message.replace(/\n/g, '<br>')}
                  </div>
                </div>

                <p style="color: #666; font-size: 14px;">
                  This feedback was submitted through the EcoMetrics feedback form.
                  Please respond to the user at: <strong>${email}</strong>
                </p>
              </div>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Feedback email sent to rautrohit1806@gmail.com`);
      }
    } catch (emailError) {
      console.error('Error sending feedback email:', emailError);
      // Don't fail the request if email fails, just log it
    }

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully! We\'ll get back to you soon.',
      feedback
    });

  } catch (err) {
    console.error('Feedback submission error:', err);
    res.status(500).json({
      error: 'Could not submit feedback. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
