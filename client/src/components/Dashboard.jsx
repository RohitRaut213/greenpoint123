import React from 'react';
import { FaLeaf, FaRecycle } from 'react-icons/fa';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User', points: 180 };
  // Get action history from localStorage
  const actionHistory = JSON.parse(localStorage.getItem('actionHistory') || '[]');

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-700 text-white py-8 px-6">
        <h1 className="text-2xl font-extrabold mb-12">GreenPoint</h1>
        <ul className="space-y-4 font-medium">
          <li><a href="#" className="hover:text-green-200">Dashboard</a></li>
          <li><button className="hover:text-green-200 bg-transparent border-0 p-0 m-0 text-left" style={{cursor:'pointer'}} onClick={() => navigate('/add-action')}>Submit Action</button></li>
          <li><button className="hover:text-green-200 bg-transparent border-0 p-0 m-0 text-left" style={{cursor:'pointer'}} onClick={() => navigate('/rewards')}>Rewards</button></li>
<li><button className="hover:text-green-200 bg-transparent border-0 p-0 m-0 text-left" style={{cursor:'pointer'}} onClick={() => navigate('/leaderboard')}>Leaderboard</button></li>
          <li>
            <a href="#" className="hover:text-green-200 flex items-center">
              <MdOutlineAdminPanelSettings className="mr-2" /> Admin Panel
            </a>
          </li>
        </ul>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
          }}
          className="mt-auto w-full bg-green-800 hover:bg-green-900 text-white py-2 rounded font-semibold mt-12"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-10 py-10">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              Welcome, {user.name} <FaLeaf className="text-green-600" />
            </h2>
            <p className="text-gray-600 text-base mt-1">Track your carbon-saving actions and earn points!</p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-4">Log New Eco Action</h3>
              <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
                  onClick={() => navigate('/add-action')}
                >
                  + Add Action
                </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border flex flex-col justify-center items-center">
              <h3 className="font-semibold text-gray-900 mb-2">Total Green Points</h3>
              <div className="text-5xl text-green-700 font-extrabold">{user.points}</div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border max-w-xl">
            <h3 className="font-semibold text-gray-900 mb-3">Action History</h3>
            {actionHistory.length === 0 ? (
              <div className="text-gray-400">No actions yet</div>
            ) : (
              <ul className="space-y-2 text-gray-800">
                {actionHistory.map((a, i) => (
                  <li key={i} className="flex items-center">
                    {a.type === 'tree' && <FaLeaf className="inline text-green-600 mr-2" />}
                    {a.type === 'transport' && <FaRecycle className="inline text-green-600 mr-2" />}
                    <span>{a.actionText}</span>
                    <span className="ml-2 text-xs text-gray-500">{new Date(a.timestamp).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
