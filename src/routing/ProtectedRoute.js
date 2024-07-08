import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, adminOnly }) => {
  const { user } = useAuth();

  console.log('ProtectedRoute called, user:', user);

  if (user === null) {
    console.log('No user, navigating to login');
    return <Navigate to="/login" />;
  }

  if (adminOnly && !user.is_admin) {
    console.log('User is not admin, navigating to home');
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
