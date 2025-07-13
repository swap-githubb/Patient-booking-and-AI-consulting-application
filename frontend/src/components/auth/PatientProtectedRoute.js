import React from 'react';
import { Navigate } from 'react-router-dom';

const PatientProtectedRoute = ({ children }) => {
  // Check for the patient's authentication token in local storage
  const token = localStorage.getItem('patientToken');

  if (!token) {
    // If the token does not exist, redirect the user to the patient login page.
    // The 'replace' prop prevents the user from clicking the 'back' button
    // and returning to the protected page after being redirected.
    return <Navigate to="/patient/login" replace />;
  }

  // If the token exists, render the child component (the protected page)
  return children;
};

export default PatientProtectedRoute;