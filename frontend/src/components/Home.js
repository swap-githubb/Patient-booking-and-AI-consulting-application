import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Card, CardContent, Typography, Button, Avatar, Box } from '@mui/material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PersonIcon from '@mui/icons-material/Person';


const medicalBackgroundUrl = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1920&q=80';

function Home() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        // Background Image Styling
        backgroundImage: `url(${medicalBackgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // Overlay to improve contrast
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 30, 60, 0.65)', // A dark blue overlay
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom sx={{ color: 'white', fontWeight: 700 }}>
          Welcome to Your Health Hub
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 6 }}>
          Connect with doctors or manage your health journey. Please identify your role to continue.
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={5}>
            <Card
              sx={{
                // Glassmorphism effect
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                borderRadius: 4, // Softer corners
                transition: 'background-color 0.3s, transform 0.3s',
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-8px)',
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Avatar sx={{ bgcolor: 'rgba(25, 118, 210, 0.7)', width: 64, height: 64, m: 'auto' }}>
                  <MedicalServicesIcon fontSize="large" sx={{ color: 'white' }} />
                </Avatar>
                <Typography variant="h4" sx={{ mt: 3, mb: 2 }}>
                  Doctor
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 3 }}>
                  Access your dashboard, manage appointments, and update your availability.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button variant="contained" onClick={() => navigate('/doctor/login')}>
                    Login
                  </Button>
                  <Button variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.7)', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(25, 118, 210, 0.1)' } }} onClick={() => navigate('/doctor/register')}>
                    Register
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <Card
              sx={{
                // Glassmorphism effect
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                borderRadius: 4,
                 transition: 'background-color 0.3s, transform 0.3s',
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-8px)',
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Avatar sx={{ bgcolor: 'rgba(66, 66, 66, 0.7)', width: 64, height: 64, m: 'auto' }}>
                  <PersonIcon fontSize="large" sx={{ color: 'white' }} />
                </Avatar>
                <Typography variant="h4" sx={{ mt: 3, mb: 2 }}>
                  Patient
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 3 }}>
                  Book new appointments, view your history, and start AI-powered consultations.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button variant="contained" color="secondary" onClick={() => navigate('/patient/login')}>
                    Login
                  </Button>
                  <Button variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.7)', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(66, 66, 66, 0.2)' } }} color="secondary" onClick={() => navigate('/patient/register')}>
                    Register
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;