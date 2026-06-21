import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Protected Route wrapper for React Router
 * Redirects unauthenticated users to the Login page.
 * Optionally restricts access to Admin role only.
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && (!user || user.role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  return children;
}
