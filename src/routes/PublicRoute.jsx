import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    // Redirect authenticated users to their dashboard
    switch (user.role) {
      case 'customer':
        return <Navigate to="/customer/dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'delivery':
        return <Navigate to="/delivery/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PublicRoute;
