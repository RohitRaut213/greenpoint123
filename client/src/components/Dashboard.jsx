import { useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import { FaLeaf, FaRecycle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import plantSuggestions from '../data/plantSuggestions';

function Dashboard() {
  const { user: clerkUser } = useUser();
  const navigate = useNavigate();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [user, setUser] = useState({});
  const [actionHistory, setActionHistory] = useState([]);

  useEffect(() => {
    const userId = clerkUser?.id;
    const userKey = userId ? `user_${userId}` : 'user';
    const historyKey = userId ? `actionHistory_${userId}` : 'actionHistory';
    const storedUser = JSON.parse(localStorage.getItem(userKey)) || { name: clerkUser?.firstName || 'User', points: 0, co2saved: 0, email };
    const storedHistory = JSON.parse(localStorage.getItem(historyKey)) || [];

    setUser(storedUser);
    setActionHistory(storedHistory);
  }, [clerkUser]);

  return (
    <div className="d-flex vh-100 bg-light" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside
        className={`bg-success text-white p-3 d-flex flex-column position-fixed transition-all`}
        style={{
          width: isSidebarExpanded ? '280px' : '80px',
          height: '100vh',
          zIndex: 1000,
          left: 0,
          top: 0,
          overflow: 'hidden',
          transition: 'width 0.3s ease-in-out',
          cursor: 'pointer'
        }}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        {/* Logo/Brand */}
        <div className="mb-4 d-flex align-items-center">
          <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
            <span className="text-success fw-bold fs-5">E</span>
          </div>
          {isSidebarExpanded && <h1 className="h5 fw-bold mb-0">EcoMetrics</h1>}
        </div>

        {/* Navigation */}
        <ul className="nav flex-column mb-auto fw-medium">
          <li className="nav-item mb-3">
            <a href="#" className="nav-link text-white py-2 px-3 rounded d-flex align-items-center">
              <i className="fas fa-tachometer-alt fs-5"></i>
              {isSidebarExpanded && <span className="ms-3">Dashboard</span>}
            </a>
          </li>
          <li className="nav-item mb-3">
            <button
              className="nav-link text-white btn btn-link p-0 text-start w-100 py-2 px-3 rounded d-flex align-items-center"
              style={{textAlign:'left'}}
              onClick={() => navigate('/add-action')}
            >
              <i className="fas fa-plus-circle fs-5"></i>
              {isSidebarExpanded && <span className="ms-3">Submit Action</span>}
            </button>
          </li>
          <li className="nav-item mb-3">
            <button
              className="nav-link text-white btn btn-link p-0 text-start w-100 py-2 px-3 rounded d-flex align-items-center"
              style={{textAlign:'left'}}
              onClick={() => navigate('/rewards')}
            >
              <i className="fas fa-gift fs-5"></i>
              {isSidebarExpanded && <span className="ms-3">Rewards</span>}
            </button>
          </li>
          <li className="nav-item mb-3">
            <button
              className="nav-link text-white btn btn-link p-0 text-start w-100 py-2 px-3 rounded d-flex align-items-center"
              style={{textAlign:'left'}}
              onClick={() => navigate('/leaderboard')}
            >
              <i className="fas fa-trophy fs-5"></i>
              {isSidebarExpanded && <span className="ms-3">Leaderboard</span>}
            </button>
          </li>
          <li className="nav-item mb-3">
            <button
              className="nav-link text-white d-flex align-items-center btn btn-link p-0 text-start w-100 py-2 px-3 rounded"
              style={{textAlign:'left'}}
              onClick={() => navigate('/feedback')}
            >
              <i className="fas fa-envelope fs-5"></i>
              {isSidebarExpanded && <span className="ms-2">Send Feedback</span>}
            </button>
          </li>
        </ul>

        {/* Logout Button */}
        <div className="mt-auto">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/';
            }}
            className="btn btn-dark w-100 fw-semibold py-2 d-flex align-items-center justify-content-center"
          >
            <i className="fas fa-sign-out-alt"></i>
            {isSidebarExpanded && <span className="ms-2">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 ms-auto" style={{
        marginLeft: isSidebarExpanded ? '280px' : '80px',
        overflowY: 'auto',
        height: '100vh',
        transition: 'margin-left 0.3s ease-in-out'
      }}>
        <div className="p-4">
          <div className="container-fluid">
            <header className="mb-4">
              <h2 className="h2 fw-bold text-dark d-flex align-items-center gap-2">
                Welcome, {user.name} <FaLeaf className="text-success" />
              </h2>
              <p className="text-secondary mt-1">Track your carbon-saving actions and earn points!</p>
            </header>

            <section className="row g-4 mb-4">
              <div className="col-md-6">
                <div className="card h-100 shadow-sm border">
                  <div className="card-body text-center">
                    <h3 className="fw-semibold text-dark mb-3">Log New Eco Action</h3>
                    <button
                      className="btn btn-success fw-semibold px-4 py-2"
                      onClick={() => navigate('/add-action')}
                    >
                      <i className="fas fa-plus me-2"></i>Add Action
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100 shadow-sm border d-flex flex-column justify-content-center align-items-center p-4">
                  <h3 className="fw-semibold text-dark mb-2">Total Green Points</h3>
                  <div className="display-4 text-success fw-bold">{user.points}</div>
                </div>
              </div>
            </section>

            <section className="card shadow-sm border mb-4">
              <div className="card-body">
                <h3 className="fw-semibold text-dark mb-3">Action History</h3>
                {actionHistory.length === 0 ? (
                  <div className="text-center text-secondary py-4">No actions yet</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Type</th>
                          <th>Action</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {actionHistory.map((a, i) => (
                          <tr key={i}>
                            <td>
                              {a.type === 'tree' && <FaLeaf className="text-success me-2" />}
                              {a.type === 'transport' && <FaRecycle className="text-success me-2" />}
                            </td>
                            <td>{a.actionText}</td>
                            <td className="small text-secondary">{new Date(a.timestamp).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>

            {/* Plant Suggestions Section */}
            <section className="mb-5">
              <div className="card shadow-sm border">
                <div className="card-body">
                  <h3 className="fw-semibold text-success mb-3">
                    <i className="fas fa-seedling me-2"></i>Suggested Plants & Trees by Region
                  </h3>
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
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
