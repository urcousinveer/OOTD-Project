// src/App.js
import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthPage from './components/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './components/HomePage';
import UploadClothingForm from './components/UploadClothingForm';
import Wardrobe from './components/Wardrobe';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public auth screens */}
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />

        {/* All routes below are protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wardrobe"
          element={
            <ProtectedRoute>
              <Wardrobe />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <UploadClothingForm />
            </ProtectedRoute>
          }
        />

        {/* Fallback: redirect to login if no match */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />

    </Router>
  );
}
