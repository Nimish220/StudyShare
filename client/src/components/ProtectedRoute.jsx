import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('studyshare_user');
  const location = useLocation(); // This captures where the user was trying to go

  const isAuthenticated = token && token !== 'undefined' && token !== 'null' && user;

  if (!isAuthenticated) {
    // If it's a zombie (fake string), clear it out
    if (token) localStorage.clear();
    
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;