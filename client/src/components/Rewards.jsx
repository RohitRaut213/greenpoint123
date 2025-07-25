import React from 'react';

function Rewards() {
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User', points: 0, co2saved: 0 };
  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
      <div className="card shadow border-0 p-4 w-100 text-center" style={{maxWidth: 400}}>
        <h2 className="h4 fw-bold mb-4 text-success">Your Rewards</h2>
        <div className="display-4 fw-bold text-success mb-2">{user.points}</div>
        <div className="fs-5 text-dark mb-3">Total Green Points</div>
        <div className="display-6 fw-bold text-primary mb-2">{user.co2saved ? user.co2saved.toFixed(2) : 0} kg CO₂ saved</div>
        <div className="fs-6 text-dark">CO₂ emissions minimised by your actions</div>
        <p className="mt-3 text-secondary">Earn more points by logging eco-friendly actions!</p>
      </div>
    </div>
  );
}

export default Rewards;
