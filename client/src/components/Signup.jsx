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
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6f8]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">Sign Up</h2>
        {error && <div className="mb-4 text-red-600 text-sm text-center">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-medium">Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-medium">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>
        <div className="mb-6">
          <label className="block mb-1 text-gray-700 font-medium">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
        </div>
        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition">Sign Up</button>
        <div className="mt-4 text-center text-gray-600 text-sm">
          Already have an account?
          <button
            type="button"
            className="ml-2 text-green-700 font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-green-400 px-2 py-1 rounded"
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
