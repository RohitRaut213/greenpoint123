import React from 'react';
import { useNavigate } from 'react-router-dom';

function AddAction() {
  const navigate = useNavigate();

  const handleAction = (type) => {
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'User', points: 0 };
    let points = user.points || 0;
    let actionText = '';
    if (type === 'tree') {
      points += 100;
      actionText = 'Planted a tree';
    } else if (type === 'transport') {
      points += 50;
      actionText = 'Used public transport';
    }
    // Update user points
    const updatedUser = { ...user, points };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    // Update action history
    const history = JSON.parse(localStorage.getItem('actionHistory') || '[]');
    history.unshift({ type, actionText, timestamp: new Date().toISOString() });
    localStorage.setItem('actionHistory', JSON.stringify(history));
    // Also update lastAction for backward compatibility
    localStorage.setItem('lastAction', type);
    // Redirect back to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
      <div className="card shadow border-0 p-4 w-100 text-center" style={{maxWidth: 400}}>
        <h2 className="h4 fw-bold mb-4 text-success">Choose an Eco Action</h2>
        <button
          className="btn btn-success w-100 mb-3 fw-semibold fs-5 py-2"
          onClick={() => handleAction('tree')}
        >
          Plant a Tree (+100 points)
        </button>
        <button
          className="btn btn-primary w-100 fw-semibold fs-5 py-2"
          onClick={() => handleAction('transport')}
        >
          Travelled through Public Transport (+50 points)
        </button>
      </div>
    </div>
  );
}

export default AddAction;
