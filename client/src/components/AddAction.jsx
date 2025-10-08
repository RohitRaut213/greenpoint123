import { useUser } from '@clerk/clerk-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CameraModal from './CameraModal';

function AddAction() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [cameraOpen, setCameraOpen] = React.useState(false);
  const [cameraAction, setCameraAction] = React.useState(null); // 'tree' or 'transport'
  const [capturedImage, setCapturedImage] = React.useState(null);
  const [pointsEarned, setPointsEarned] = React.useState(0);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Emission factors
  const TREE_CO2 = 21; // kg per tree per year
  const CAR_CO2 = 0.15; // kg per km
  const TRANSIT_CO2 = 0.05; // kg per km

  const handleAction = (type) => {
    setError('');
    setCameraAction(type);
    setCameraOpen(true);
  };

  const handleCameraCapture = async (imgData) => {
    setCameraOpen(false);
    setLoading(true);
    setError("");

    try {
      // Send image to backend for verification/storage
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imgData, actionType: cameraAction, userId: user?.id, clerkId: user?.id })
      });
      const data = await res.json();

      if (data.url) {
        // Auto-award points based on action type
        const userId = user?.id;
        const email = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || undefined;
        const userKey = userId ? `user_${userId}` : 'user';
        const historyKey = userId ? `actionHistory_${userId}` : 'actionHistory';

        const userObj = JSON.parse(localStorage.getItem(userKey)) || { name: user?.firstName || 'User', points: 0, co2saved: 0, email };

        let points = userObj.points || 0;
        let co2saved = userObj.co2saved || 0;
        let actionText = '';
        let co2 = 0;
        let pts = 0;

        if (cameraAction === 'tree') {
          // Award points for planting a tree (default 1 tree)
          const numTrees = 1;
          co2 = TREE_CO2 * numTrees;
          pts = Math.round(co2);
          points += pts;
          co2saved += co2;
          actionText = `Planted ${numTrees} tree (saved ${co2} kg CO₂/year) - Photo verified`;
        } else if (cameraAction === 'transport') {
          // Award points for public transport (default 1 km)
          const distance = 1;
          co2 = (CAR_CO2 - TRANSIT_CO2) * distance;
          pts = Math.round(co2);
          points += pts;
          co2saved += co2;
          actionText = `Travelled ${distance} km by public transport (saved ${co2.toFixed(2)} kg CO₂) - Photo verified`;
        }

        // Update user data
        const updatedUser = { ...userObj, points, co2saved, email };
        localStorage.setItem(userKey, JSON.stringify(updatedUser));

        // Update history
        const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
        history.unshift({
          type: cameraAction,
          actionText,
          co2,
          points: pts,
          timestamp: new Date().toISOString(),
          email,
          photoVerified: true,
          imageUrl: data.url
        });
        localStorage.setItem(historyKey, JSON.stringify(history));

        // Set success state
        setCapturedImage(data.url);
        setPointsEarned(pts);
        setShowSuccess(true);
        setError('');

        // Show success message with points earned
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);

      } else {
        setError(data.error || "Photo verification failed");
      }
    } catch (err) {
      setError("Photo processing failed. Please try again.");
    }
    setLoading(false);
  };

  const handleTreeSubmit = (e) => {
    e.preventDefault();
    setError('');
    const n = parseInt(numTrees, 10);
    if (isNaN(n) || n <= 0) { // changed from n < 1 to n <= 0
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
          onClick={() => handleAction('tree')}
          disabled={loading}
        >
          Plant a Tree (open camera)
        </button>
        <button
          className="btn btn-primary w-100 fw-semibold fs-5 py-2"
          onClick={() => handleAction('transport')}
          disabled={loading}
        >
          Travelled through Public Transport (open camera)
        </button>
        <CameraModal
          isOpen={cameraOpen}
          onClose={() => setCameraOpen(false)}
          onCapture={handleCameraCapture}
        />
        {showSuccess && (
          <div className="mt-4">
            <div className="alert alert-success py-3">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <i className="fas fa-check-circle fa-2x text-success"></i>
                </div>
                <div>
                  <h5 className="mb-1">Eco Action Verified!</h5>
                  <p className="mb-1">
                    You earned <strong className="text-success">{pointsEarned} green points</strong>!
                  </p>
                  <small className="text-muted">Redirecting to dashboard...</small>
                </div>
              </div>
            </div>
          </div>
        )}
        {capturedImage && !showSuccess && (
          <div className="mt-4">
            <h5>Captured Image ({cameraAction === 'tree' ? 'Plant a Tree' : 'Public Transport'})</h5>
            <img src={capturedImage} alt="Captured" style={{width: 320, borderRadius: 8}} />
          </div>
        )}
        {error && <div className="alert alert-danger py-2 small">{error}</div>}
      </div>
    </div>
  );
}

export default AddAction;
