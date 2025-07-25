import React, { useState } from 'react';

function SendFeedback() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const supportEmail = 'rautrohit1806@gmail.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);
    try {
      const mailto = `mailto:${supportEmail}?subject=GreenPoint%20Support%20Feedback&body=From:%20${encodeURIComponent(email)}%0A%0A${encodeURIComponent(message)}`;
      window.location.href = mailto;
      setStatus('Opening your email client...');
    } catch (err) {
      setStatus('Could not open email client. Please email us directly.');
    }
    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-2">
      <div className="w-100" style={{ maxWidth: 420 }}>
        <div className="card shadow border-0 p-4">
          <div className="text-center mb-4">
            <h2 className="h4 fw-bold text-success">Send Feedback</h2>
            <p className="text-secondary small mb-0">Let us know your thoughts or issues. We'll get back to you soon!</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Your Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea
                className="form-control"
                rows={5}
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                placeholder="Type your feedback or support request here..."
              />
            </div>
            <button type="submit" className="btn btn-success w-100 fw-bold" disabled={loading}>
              {loading ? 'Sending...' : 'Send Feedback'}
            </button>
            {status && <div className="alert alert-info mt-3 text-center small">{status}</div>}
          </form>
          <div className="mt-3 text-center text-secondary small">
            Or email us directly at <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SendFeedback;
