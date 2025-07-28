import React, { useState } from 'react';

function SendFeedback() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message })
      });
      if (res.ok) {
        setStatus('Feedback submitted! Thank you for your input.');
        setEmail('');
        setMessage('');
      } else {
        setStatus('Could not submit feedback. Please try again later.');
      }
    } catch (err) {
      setStatus('Could not submit feedback. Please try again later.');
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

        </div>
      </div>
    </div>
  );
}

export default SendFeedback;
