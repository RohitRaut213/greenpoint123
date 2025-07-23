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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-green-700">Choose an Eco Action</h2>
        <button
          className="w-full mb-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-semibold transition"
          onClick={() => handleAction('tree')}
        >
          Plant a Tree (+100 points)
        </button>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition"
          onClick={() => handleAction('transport')}
        >
          Travelled through Public Transport (+50 points)
        </button>
      </div>
    </div>
  );
}

export default AddAction;
