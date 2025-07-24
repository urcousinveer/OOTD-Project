// web/src/App.js
import './App.css';

import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import AuthPage from './components/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './components/HomePage'; // ← your new styled HomePage

export default function App() {
  return (
    <Router>
      <Routes>
        {/* only signed-in users get HomePage */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* Auth screens */}
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />

        {/* catch-all → redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
