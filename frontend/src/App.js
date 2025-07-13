import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './components/ClinicalConsultation/styles/globalStyles';
import Home from './components/Home';
import DoctorRegister from './components/Doctor/DoctorRegister';
import DoctorLogin from './components/Doctor/DoctorLogin';
import DoctorDashboard from './components/Doctor/DoctorDashboard';
import PatientRegister from './components/Patient/PatientRegister';
import PatientLogin from './components/Patient/PatientLogin';
import PatientDashboard from './components/Patient/PatientDashboard';
import ClinicalConsultation from './components/ClinicalConsultation/ClinicalConsultation';

import PatientProtectedRoute from './components/auth/PatientProtectedRoute';
import DoctorProtectedRoute from './components/auth/DoctorProtectedRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctor/register" element={<DoctorRegister />} />
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/patient/register" element={<PatientRegister />} />
          <Route path="/patient/login" element={<PatientLogin />} />


           <Route 
            path="/doctor/dashboard" 
            element={
              <DoctorProtectedRoute>
                <DoctorDashboard />
              </DoctorProtectedRoute>
            } 
          />

           <Route 
            path="/patient/dashboard" 
            element={
              <PatientProtectedRoute>
                <PatientDashboard />
              </PatientProtectedRoute>
            } 
          />
          <Route 
            path="/patient/consultation" 
            element={
              <PatientProtectedRoute>
                <ClinicalConsultation />
              </PatientProtectedRoute>
            } 
          />
          
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;