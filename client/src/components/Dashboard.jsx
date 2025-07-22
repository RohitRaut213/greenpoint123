import React from 'react';
import { FaLeaf, FaRecycle } from 'react-icons/fa';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User', points: 180 };
  // Sample actions
  const actions = [
    { icon: <FaRecycle className="inline text-green-600 mr-1" />, desc: 'Used public transport', status: 'Approved' },
    { icon: <FaLeaf className="inline text-green-600 mr-1" />, desc: 'Planted a tree', status: 'Pending' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-700 text-white flex flex-col py-8 px-6">
        <div className="text-2xl font-bold mb-10">GreenPoint</div>
        <nav className="flex-1">
          <ul className="space-y-4">
            <li><a href="#" className="hover:text-green-200 font-semibold">Dashboard</a></li>
            <li><a href="#" className="hover:text-green-200">Submit Action</a></li>
            <li><a href="#" className="hover:text-green-200">Rewards</a></li>
            <li><a href="#" className="hover:text-green-200 flex items-center"><MdOutlineAdminPanelSettings className="mr-2" />Admin Panel</a></li>
            <li>
              <button
                className="mt-8 bg-green-900 hover:bg-green-800 w-full py-2 rounded text-white font-semibold"
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  window.location.href = '/';
                }}
              >Logout</button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-2">
          Welcome, {user.name} <FaLeaf className="ml-2 text-green-600" />
        </h1>
        <p className="mb-6 text-gray-600">Track your carbon-saving actions and earn points!</p>

        {/* Log New Eco Action */}
        <div className="bg-white rounded shadow p-6 mb-6 max-w-2xl">
          <div className="font-semibold mb-2">Log New Eco Action</div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold">+ Add Action</button>
        </div>

        {/* Actions and Points */}
        <div className="flex flex-wrap gap-6">
          {/* Recent Actions */}
          <div className="bg-white rounded shadow p-6 flex-1 min-w-[300px]">
            <div className="font-semibold mb-2">Recent Actions</div>
            <ul className="list-disc ml-6 text-gray-700">
              {actions.map((a, i) => (
                <li key={i} className="mb-1">
                  {a.icon} {a.desc} –{' '}
                  <span className={a.status === 'Approved' ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                    {a.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* Points */}
          <div className="bg-white rounded shadow p-6 flex-1 min-w-[200px] flex flex-col items-center justify-center">
            <div className="font-semibold mb-2">Total Green Points</div>
            <div className="text-4xl text-green-700 font-bold">{user.points}</div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
