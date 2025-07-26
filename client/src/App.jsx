import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import React from "react";
import "./App.css";

import { Navigate, Route, Routes } from 'react-router-dom';
import AddAction from './components/AddAction.jsx';
import Dashboard from './components/Dashboard.jsx';
import Leaderboard from './components/Leaderboard.jsx';
import Rewards from './components/Rewards.jsx';
import SendFeedback from './components/SendFeedback.jsx';

export default function App() {
  return (
    <div>
      <SignedOut>
        <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
          <h2 className="mb-4">Welcome to GreenPoint!</h2>
          <SignInButton mode="modal">
            <button className="btn btn-success mb-2">Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="btn btn-outline-success">Sign Up</button>
          </SignUpButton>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="container-fluid">
          <div className="d-flex justify-content-end p-3">
            <UserButton afterSignOutUrl="/" />
          </div>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-action" element={<AddAction />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/feedback" element={<SendFeedback />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </SignedIn>
    </div>
  );
}
