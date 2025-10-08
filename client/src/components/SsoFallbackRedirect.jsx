import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SsoFallbackRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle SSO fallback redirect logic
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <div className="card">
            <div className="card-body">
              <h3>Redirecting...</h3>
              <p>Please wait while we redirect you to the dashboard.</p>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SsoFallbackRedirect;
