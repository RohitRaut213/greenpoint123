import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onSwitchToSignup }) 
{
  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Check localStorage for user
    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
    const found = allUsers.find(u => u.email === user.email && u.password === user.password);
    if (found) {
      localStorage.setItem("user", JSON.stringify(found));
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } else {
      setError("Invalid credentials. Please try again.");
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
          <input
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
            className="form-control mb-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
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
        <div className="mt-4 text-center">
          <p className="small text-secondary mb-0">
            Don’t have an account?
            <button
              onClick={onSwitchToSignup}
              type="button"
              className="ms-1 text-success fw-semibold text-decoration-underline btn btn-link p-0 align-baseline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
  );
}

export default Login;
