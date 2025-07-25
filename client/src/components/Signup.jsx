import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }
    // Save user to localStorage
    const user = { name, email, password, points: 0 };
    localStorage.setItem("user", JSON.stringify(user));
    // Add to allUsers for leaderboard
    let allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
    if (!allUsers.some(u => u.email === email)) {
      allUsers.push(user);
      localStorage.setItem("allUsers", JSON.stringify(allUsers));
    }
    navigate("/dashboard");
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <form onSubmit={handleSubmit} className="card shadow border-0 p-4 w-100" style={{maxWidth: 400}}>
        <h2 className="h4 fw-bold mb-4 text-success text-center">Sign Up</h2>
        {error && <div className="alert alert-danger py-2 text-center small mb-3">{error}</div>}
        <div className="mb-3">
          <label className="form-label fw-medium">Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label fw-medium">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" />
        </div>
        <div className="mb-4">
          <label className="form-label fw-medium">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-control" />
        </div>
        <button type="submit" className="btn btn-success w-100 fw-bold py-2">Sign Up</button>
        <div className="mt-3 text-center text-secondary small">
          Already have an account?
          <button
            type="button"
            className="ms-2 text-success fw-semibold text-decoration-underline btn btn-link p-0 align-baseline"
            onClick={() => navigate("/")}
          >
            Log In
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
