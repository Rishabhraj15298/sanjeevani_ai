import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Patient from './pages/Patient';
import Doctor from './pages/Doctor';

function PrivateRoute({ children, role }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!token || !user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/patient"
        element={
          <PrivateRoute role="patient">
            <Patient />
          </PrivateRoute>
        }
      />
      <Route
        path="/doctor"
        element={
          <PrivateRoute role="doctor">
            <Doctor />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
