import { useUser } from '@clerk/clerk-react';
import React, { useState } from 'react';
import { FaAmazon, FaGift, FaShoppingBag } from 'react-icons/fa';

function Rewards() {
  const { user: clerkUser } = useUser();
  const [redeemStatus, setRedeemStatus] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);

  const userId = clerkUser?.id;
  const userKey = userId ? `user_${userId}` : 'user';
  const user = JSON.parse(localStorage.getItem(userKey)) || { name: clerkUser?.firstName || 'User', points: 0, co2saved: 0 };

  // Coupon data with point costs
  const coupons = [
    {
      id: 'amazon',
      brand: 'Amazon',
      icon: <FaAmazon className="text-warning" />,
      title: '₹100 Amazon Gift Card',
      description: 'Shop millions of products with free delivery',
      points: 500,
      color: 'warning',
      bgColor: 'bg-warning-subtle'
    },
    {
      id: 'flipkart',
      brand: 'Flipkart',
      icon: <FaShoppingBag className="text-primary" />,
      title: '₹150 Flipkart Voucher',
      description: 'Best deals on electronics, fashion & more',
      points: 750,
      color: 'primary',
      bgColor: 'bg-primary-subtle'
    }
  ];

  // Function to handle coupon redemption
  const handleRedeemCoupon = async (coupon) => {
    if (user.points < coupon.points) {
      setRedeemStatus(`❌ Insufficient points! You need ${coupon.points - user.points} more points.`);
      return;
    }

    setIsRedeeming(true);
    setRedeemStatus('');

    try {
      console.log('Attempting to redeem coupon:', coupon.id);

      // Test if server is reachable first
      const response = await fetch('/api/redeem-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          couponId: coupon.id,
          couponCode: `${coupon.brand.toUpperCase()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          pointsSpent: coupon.points,
          userEmail: user.email
        })
      });

      console.log('Redemption response status:', response.status);

      if (response.ok) {
        // Update local storage - deduct points
        const updatedUser = { ...user, points: user.points - coupon.points };
        localStorage.setItem(userKey, JSON.stringify(updatedUser));

        // Generate coupon code
        const couponCode = `${coupon.brand.toUpperCase()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        // Send email with coupon code (optional - don't fail if email fails)
        try {
          await fetch('/api/send-coupon-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              couponCode,
              brand: coupon.brand,
              description: coupon.description
            })
          });
        } catch (emailError) {
          console.warn('Email sending failed, but redemption succeeded:', emailError);
          // Don't fail the redemption if email fails
        }

        setRedeemStatus(`✅ Successfully redeemed ${coupon.title}! Your coupon code: <strong>${couponCode}</strong>${user.email ? ' (check your email for confirmation)' : ''}`);

        // Force refresh to update points display
        window.location.reload();

      } else {
        const errorText = await response.text();
        console.error('Redemption failed with status:', response.status, 'Response:', errorText);
        setRedeemStatus(`❌ Redemption failed (${response.status}). Please try again.`);
      }
    } catch (error) {
      console.error('Redemption error:', error);
      setRedeemStatus(`❌ Network error: ${error.message}. Please check if the server is running.`);
    } finally {
      setIsRedeeming(false);
    }
  };

  // Early return if no user
  if (!clerkUser) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <h3 className="text-muted">Please sign in to view rewards</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8">
            <div className="card shadow border-0">
              <div className="card-body text-center py-5">
                <h2 className="h3 fw-bold mb-4 text-success">
                  <FaGift className="me-2" />
                  Your Rewards Dashboard
                </h2>

                <div className="row g-4 mb-4">
                  <div className="col-6">
                    <div className="display-6 fw-bold text-success">{user.points}</div>
                    <div className="text-secondary">Green Points</div>
                  </div>
                  <div className="col-6">
                    <div className="display-6 fw-bold text-primary">{user.co2saved ? user.co2saved.toFixed(2) : 0} kg</div>
                    <div className="text-secondary">CO₂ Saved</div>
                  </div>
                </div>

                <div className="row g-4">
                  {coupons.map((coupon) => {
                    const isAvailable = user.points >= coupon.points;
                    return (
                      <div key={coupon.id} className="col-md-6">
                        <div className={`card ${coupon.bgColor} border-0`}>
                          <div className="card-body p-4">
                            <div className="d-flex align-items-center mb-3">
                              {coupon.icon}
                              <div className="ms-3">
                                <h6 className="fw-bold mb-0">{coupon.brand}</h6>
                                <small className="text-secondary">{coupon.title}</small>
                              </div>
                            </div>
                            <p className="small mb-3">{coupon.description}</p>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <span className={`badge bg-${coupon.color}`}>{coupon.points} Points</span>
                              <span className={`badge ${isAvailable ? 'bg-success' : 'bg-secondary'}`}>
                                {isAvailable ? 'Available' : 'Locked'}
                              </span>
                            </div>
                            <button
                              className={`btn w-100 fw-semibold ${isAvailable ? `btn-${coupon.color}` : 'btn-secondary'}`}
                              disabled={!isAvailable || isRedeeming}
                              onClick={() => handleRedeemCoupon(coupon)}
                            >
                              {isRedeeming ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                  Redeeming...
                                </>
                              ) : isAvailable ? (
                                '🎁 Redeem Now'
                              ) : (
                                `Need ${coupon.points - user.points} more points`
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {redeemStatus && (
                  <div className={`alert mt-4 ${redeemStatus.includes('✅') ? 'alert-success' : 'alert-danger'}`}>
                    <div dangerouslySetInnerHTML={{ __html: redeemStatus }} />
                  </div>
                )}

                <div className="mt-5 p-4 bg-success text-white rounded">
                  <h5 className="fw-bold mb-3">How to Earn More Points</h5>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="text-center">
                        <div className="fs-4 mb-2">🌳</div>
                        <h6>Plant Trees</h6>
                        <small>Each tree = 21 points per year</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center">
                        <div className="fs-4 mb-2">🚌</div>
                        <h6>Use Public Transport</h6>
                        <small>Each km = 0.1 points saved</small>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="text-center">
                        <div className="fs-4 mb-2">♻️</div>
                        <h6>Recycle</h6>
                        <small>Track your recycling efforts</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rewards;
