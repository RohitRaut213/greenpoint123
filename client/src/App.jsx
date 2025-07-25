import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import AddAction from './components/AddAction.jsx';
import Dashboard from './components/Dashboard.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Login from './components/Login.jsx';
import Rewards from './components/Rewards.jsx';
import SendFeedback from './components/SendFeedback.jsx';
import Signup from './components/Signup.jsx';

function App() {
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />
          }
        />
        <Route path="/add-action" element={<AddAction />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/feedback" element={<SendFeedback />} />
      </Routes>
    </div>
  );
}

export default App;
