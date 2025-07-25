import React from 'react';
import { FaLeaf, FaRecycle } from 'react-icons/fa';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User', points: 180 };
  // Get action history from localStorage, filter for this user
  const actionHistoryRaw = JSON.parse(localStorage.getItem('actionHistory') || '[]');
  const actionHistory = actionHistoryRaw.filter(a => a.email === user.email);

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <aside className="bg-success text-white p-4 d-flex flex-column" style={{ minWidth: '250px', minHeight: '100vh' }}>
        <h1 className="h3 fw-bold mb-5">GreenPoint</h1>
        <ul className="nav flex-column mb-auto fw-medium">
          <li className="nav-item"><a href="#" className="nav-link text-white">Dashboard</a></li>
          <li className="nav-item"><button className="nav-link text-white btn btn-link p-0" style={{textAlign:'left'}} onClick={() => navigate('/add-action')}>Submit Action</button></li>
          <li className="nav-item"><button className="nav-link text-white btn btn-link p-0" style={{textAlign:'left'}} onClick={() => navigate('/rewards')}>Rewards</button></li>
<li className="nav-item"><button className="nav-link text-white btn btn-link p-0" style={{textAlign:'left'}} onClick={() => navigate('/leaderboard')}>Leaderboard</button></li>
          <li className="nav-item">
            <a href="#" className="nav-link text-white d-flex align-items-center">
              <MdOutlineAdminPanelSettings className="me-2" /> Admin Panel
            </a>
          </li>
        </ul>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
          }}
          className="btn btn-dark mt-auto w-100 fw-semibold mt-5"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 p-4">
        <div className="container-xl">
          <header className="mb-4">
            <h2 className="h2 fw-bold text-dark d-flex align-items-center gap-2">
              Welcome, {user.name} <FaLeaf className="text-success" />
            </h2>
            <p className="text-secondary mt-1">Track your carbon-saving actions and earn points!</p>
          </header>

          <section className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="card h-100 shadow-sm border">
                <h3 className="fw-semibold text-dark mb-3">Log New Eco Action</h3>
                <button
                  className="btn btn-success fw-semibold"
                  onClick={() => navigate('/add-action')}
                >
                  + Add Action
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100 shadow-sm border d-flex flex-column justify-content-center align-items-center p-4">
                <h3 className="fw-semibold text-dark mb-2">Total Green Points</h3>
                <div className="display-4 text-success fw-bold">{user.points}</div>
              </div>
            </div>
          </section>

          <section className="card p-4 shadow-sm border mt-4 mx-auto" style={{maxWidth: '500px'}}>
            <h3 className="fw-semibold text-dark mb-3">Action History</h3>
            {actionHistory.length === 0 ? (
              <div className="text-secondary">No actions yet</div>
            ) : (
              <ul className="list-group">
                {actionHistory.map((a, i) => (
                  <li key={i} className="list-group-item d-flex align-items-center">
                    {a.type === 'tree' && <FaLeaf className="text-success me-2" />}
                    {a.type === 'transport' && <FaRecycle className="text-success me-2" />}
                    <span>{a.actionText}</span>
                    <span className="ms-2 small text-secondary">{new Date(a.timestamp).toLocaleString()}</span>
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
