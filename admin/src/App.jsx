import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import api from './api/api.js';

function ProtectedRoute({ children }) {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    if (!token) {
      setIsVerifying(false);
      setIsValid(false);
      return;
    }

    api.get('/auth/verify')
      .then((res) => {
        if (res.data.valid) {
          setIsValid(true);
        } else {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          setIsValid(false);
        }
      })
      .catch((err) => {
        console.error('Token verification failed:', err);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setIsValid(false);
      })
      .finally(() => {
        setIsVerifying(false);
      });
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isVerifying) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#060709' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <svg viewBox="0 0 24 24" width="48" height="48" stroke="#ccff00" strokeWidth="2.5" fill="none" style={{ animation: 'spin 1.2s linear infinite' }}>
            <circle cx="12" cy="12" r="10" stroke="rgba(204,255,0,0.1)"></circle>
            <path d="M4 12a8 8 0 0 1 8-8" stroke="#ccff00"></path>
          </svg>
          <p style={{ color: '#ccff00', fontSize: '1rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>VERIFYING SESSION...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
