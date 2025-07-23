import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import AddAction from './components/AddAction.jsx';
import Dashboard from './components/Dashboard.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Login from './components/Login.jsx';
import Rewards from './components/Rewards.jsx';
import Signup from './components/Signup.jsx';

function App() {
  // State to toggle between login/signup for the root route
  const [authMode, setAuthMode] = useState('login');
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Routes>
        <Route
          path="/"
          element={
            authMode === 'login' ? (
              <Login onSwitchToSignup={() => setAuthMode('signup')} />
            ) : (
              <Signup onSwitchToLogin={() => setAuthMode('login')} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />
          }
        />
        <Route path="/add-action" element={<AddAction />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </div>
  );
}

export default App;
