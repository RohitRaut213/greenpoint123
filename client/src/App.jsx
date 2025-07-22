import './App.css';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import React, { useState } from 'react';

function App() {
  // State to toggle between login/signup for the root route
  const [authMode, setAuthMode] = useState('login');
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
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
      </Routes>
    </div>
  );
}

export default App;
