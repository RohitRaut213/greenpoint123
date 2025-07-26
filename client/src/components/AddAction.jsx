import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

function AddAction() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [distance, setDistance] = React.useState('');
  const [showDistance, setShowDistance] = React.useState(false);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showTreeForm, setShowTreeForm] = React.useState(false);
  const [numTrees, setNumTrees] = React.useState('1');

  // Emission factors
  const TREE_CO2 = 21; // kg per tree per year
  const CAR_CO2 = 0.15; // kg per km
  const TRANSIT_CO2 = 0.05; // kg per km

  const handleAction = async (type) => {
    setError('');
    setLoading(true);
    if (type === 'tree') {
      setShowTreeForm(true);
      setLoading(false);
    } else if (type === 'transport') {
      setShowDistance(true);
      setLoading(false);
    }
  };

  const handleTreeSubmit = (e) => {
    e.preventDefault();
    setError('');
    const n = parseInt(numTrees, 10);
    if (isNaN(n) || n < 1) {
      setError('Please enter a valid number of trees (1 or more)');
      return;
    }
    // Clerk userId/email for per-user storage
    const userId = user?.id;
    const email = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || undefined;
    const userKey = userId ? `user_${userId}` : 'user';
    const historyKey = userId ? `actionHistory_${userId}` : 'actionHistory';
    const userObj = JSON.parse(localStorage.getItem(userKey)) || { name: user?.firstName || 'User', points: 0, co2saved: 0, email };
    let points = userObj.points || 0;
    let co2saved = userObj.co2saved || 0;
    const co2 = TREE_CO2 * n;
    const pts = Math.round(co2);
    points += pts;
    co2saved += co2;
    const actionText = `Planted ${n} tree${n > 1 ? 's' : ''} (saved ${co2} kg CO₂/year)`;
    const updatedUser = { ...userObj, points, co2saved, email };
    localStorage.setItem(userKey, JSON.stringify(updatedUser));
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    history.unshift({ type: 'tree', actionText, co2, points: pts, numTrees: n, timestamp: new Date().toISOString(), email });
    localStorage.setItem(historyKey, JSON.stringify(history));
    localStorage.setItem(userId ? `lastAction_${userId}` : 'lastAction', 'tree');
    setShowTreeForm(false);
    setNumTrees('1');
    navigate('/dashboard');
  };

  const handleTransportSubmit = (e) => {
    e.preventDefault();
    setError('');
    const dist = parseFloat(distance);
    if (isNaN(dist) || dist <= 0) {
      setError('Please enter a valid distance (km)');
      return;
    }
    // Clerk userId/email for per-user storage
    const userId = user?.id;
    const email = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || undefined;
    const userKey = userId ? `user_${userId}` : 'user';
    const historyKey = userId ? `actionHistory_${userId}` : 'actionHistory';
    const userObj = JSON.parse(localStorage.getItem(userKey)) || { name: user?.firstName || 'User', points: 0, co2saved: 0, email };
    let points = userObj.points || 0;
    let co2saved = userObj.co2saved || 0;
    const co2 = (CAR_CO2 - TRANSIT_CO2) * dist;
    const pts = Math.round(co2);
    points += pts;
    co2saved += co2;
    const actionText = `Travelled ${dist} km by public transport (saved ${co2.toFixed(2)} kg CO₂)`;
    const updatedUser = { ...userObj, points, co2saved, email };
    localStorage.setItem(userKey, JSON.stringify(updatedUser));
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    history.unshift({ type: 'transport', actionText, co2, points: pts, distance: dist, timestamp: new Date().toISOString(), email });
    localStorage.setItem(historyKey, JSON.stringify(history));
    localStorage.setItem(userId ? `lastAction_${userId}` : 'lastAction', 'transport');
    setShowDistance(false);
    setDistance('');
    navigate('/dashboard');
  };


  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
      <div className="card shadow border-0 p-4 w-100 text-center" style={{maxWidth: 400}}>
        <h2 className="h4 fw-bold mb-4 text-success">Choose an Eco Action</h2>
        <button
          className="btn btn-success w-100 mb-3 fw-semibold fs-5 py-2"
          onClick={() => setShowTreeForm(true)}
          disabled={loading}
        >
          Plant a Tree (enter number)
        </button>
        {showTreeForm && (
          <form className="mt-4" onSubmit={handleTreeSubmit}>
            <div className="mb-3">
              <label htmlFor="numTrees" className="form-label">Number of trees planted</label>
              <input
                id="numTrees"
                type="number"
                min="1"
                step="1"
                className="form-control"
                value={numTrees}
                onChange={e => setNumTrees(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            <button type="submit" className="btn btn-success w-100 fw-bold" disabled={loading}>Submit</button>
            <button type="button" className="btn btn-link mt-2" onClick={() => { setShowTreeForm(false); setNumTrees('1'); }}>Cancel</button>
          </form>
        )}
        <button
          className="btn btn-primary w-100 fw-semibold fs-5 py-2"
          onClick={() => handleAction('transport')}
          disabled={loading}
        >
          Travelled through Public Transport (enter distance)
        </button>
        {showDistance && (
          <form className="mt-4" onSubmit={handleTransportSubmit}>
            <div className="mb-3">
              <label htmlFor="distance" className="form-label">Distance travelled (km)</label>
              <input
                id="distance"
                type="number"
                min="0.1"
                step="0.1"
                className="form-control"
                value={distance}
                onChange={e => setDistance(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={loading}>Submit</button>
            <button type="button" className="btn btn-link mt-2" onClick={() => { setShowDistance(false); setDistance(''); }}>Cancel</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AddAction;
