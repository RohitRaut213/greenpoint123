import React from 'react';

function Rewards() {
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User', points: 0 };
  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
      <div className="card shadow border-0 p-4 w-100 text-center" style={{maxWidth: 400}}>
        <h2 className="h4 fw-bold mb-4 text-success">Your Rewards</h2>
        <div className="display-4 fw-bold text-success mb-2">{user.points}</div>
        <div className="fs-5 text-dark">Total Green Points</div>
        <p className="mt-3 text-secondary">Earn more points by logging eco-friendly actions!</p>
      </div>
    </div>
  );
}

export default Rewards;
