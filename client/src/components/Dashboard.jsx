import React from 'react';
import { FaLeaf, FaRecycle } from 'react-icons/fa';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import plantSuggestions from '../data/plantSuggestions';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user: clerkUser } = useUser();
  const navigate = useNavigate();
  const userId = clerkUser?.id;
  // Restore previous localStorage logic
  const email = clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.emailAddresses?.[0]?.emailAddress || undefined;
  const userKey = userId ? `user_${userId}` : 'user';
  const historyKey = userId ? `actionHistory_${userId}` : 'actionHistory';
  const user = JSON.parse(localStorage.getItem(userKey)) || { name: clerkUser?.firstName || 'User', points: 0, co2saved: 0, email };
  const actionHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');

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
            <button className="nav-link text-white d-flex align-items-center btn btn-link p-0" style={{textAlign:'left'}} onClick={() => navigate('/feedback')}>
              <span className="me-2">📧</span> Send Feedback
            </button>
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
          {/* Plant Suggestions Section (moved to bottom) */}
          <section className="mb-5">
            <div className="card shadow-sm border mb-4">
              <div className="card-body">
                <h3 className="fw-semibold text-success mb-3">🌱 Suggested Plants & Trees by Region</h3>
                <p className="text-secondary small mb-3">Choose the right species for your area! Includes medicinal and native plants.</p>
                <div className="table-responsive">
                  <table className="table table-bordered table-striped align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Region</th>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plantSuggestions.slice(0, 8).map((plant, idx) => (
                        <tr key={idx}>
                          <td>{plant.region}</td>
                          <td>{plant.type}</td>
                          <td className="fw-semibold">{plant.name}</td>
                          <td>{plant.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-end mt-2">
                  <span className="text-secondary small">...and more! 🌳</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
