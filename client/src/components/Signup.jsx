import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!name || !email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.error || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <form onSubmit={handleSubmit} className="card shadow border-0 p-4 w-100" style={{maxWidth: 400}}>
        <h2 className="h4 fw-bold mb-4 text-success text-center">Sign Up</h2>
        {error && <div className="alert alert-danger py-2 text-center small mb-3">{error}</div>}
        <div className="mb-3">
          <label className="form-label fw-medium">Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label fw-medium">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" required />
        </div>
        <div className="mb-4">
          <label className="form-label fw-medium">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-control" required />
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success w-50 fw-bold py-2" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary w-50 fw-bold py-2"
            onClick={() => window.location.href = "/"}
          >
            Log In
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
