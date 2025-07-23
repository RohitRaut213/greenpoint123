import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onSwitchToSignup }) {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-green-700">GreenPoint</h1>
          <div className="text-5xl mt-2">🌱</div>
          <p className="mt-2 text-lg font-semibold text-gray-700">Welcome back!</p>
          <p className="text-gray-500 text-sm">Login to your account below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-bold shadow-md transition duration-200 ${
              loading
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don’t have an account?
            <button
              onClick={onSwitchToSignup}
              type="button"
              className="ml-1 text-green-700 font-semibold underline hover:text-green-900"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
