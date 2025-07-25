import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.error || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-2">
      <div className="w-100" style={{maxWidth: 400}}>
        <div className="card shadow border-0 p-4">
        <div className="text-center mb-4">
          <h1 className="h3 fw-bold text-success">GreenPoint</h1>
          <div className="display-4 mt-2">🌱</div>
          <p className="mt-2 fs-5 fw-semibold text-dark">Welcome back!</p>
          <p className="text-secondary small">Login to your account below.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          {error && <div className="alert alert-danger py-2 text-center small mb-3">{error}</div>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="form-control mb-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="form-control mb-3"
          />
          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-3 text-center text-secondary small">
          Don't have an account?
          <button
            type="button"
            className="ms-2 text-success fw-semibold text-decoration-underline btn btn-link p-0 align-baseline"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  </div>
  );
}

export default Login;