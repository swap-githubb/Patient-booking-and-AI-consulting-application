import React from 'react';
import { Navigate } from 'react-router-dom';

const DoctorProtectedRoute = ({ children }) => {
  // Check for the doctor's authentication token in local storage
  const token = localStorage.getItem('doctorToken');

  if (!token) {
    // If no token, redirect to the doctor login page.
    return <Navigate to="/doctor/login" replace />;
  }

  // If token exists, render the protected page.
  return children;
};

export default DoctorProtectedRoute;