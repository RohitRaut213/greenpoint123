import React from 'react';

function Rewards() {
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User', points: 0 };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-green-700">Your Rewards</h2>
        <div className="text-4xl font-extrabold text-green-700 mb-2">{user.points}</div>
        <div className="text-lg text-gray-700">Total Green Points</div>
        <p className="mt-4 text-gray-500">Earn more points by logging eco-friendly actions!</p>
      </div>
    </div>
  );
}

export default Rewards;
