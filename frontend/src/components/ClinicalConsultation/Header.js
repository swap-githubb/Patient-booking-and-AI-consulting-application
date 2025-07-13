import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

const Header = () => {
  return (
    <AppBar position="sticky" style={{ 
      background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(10px)'
    }}>
      <Toolbar>
        <MedicalServicesIcon style={{ 
          marginRight: '16px',
          fontSize: '32px',
          color: '#fff'
        }} />
        <Typography variant="h6" style={{
          fontWeight: 700,
          letterSpacing: '0.5px',
          textTransform: 'uppercase'
        }}>
          AI-Powered Clinical Support System
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
