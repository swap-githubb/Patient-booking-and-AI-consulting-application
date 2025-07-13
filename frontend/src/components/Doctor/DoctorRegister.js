import React, { useState } from 'react';
import { Container, Paper, Box, Typography, TextField, Button, Alert, Avatar, Link, Grid } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';

function DoctorRegister() {
  const [formData, setFormData] = useState({
    name: '',
    speciality: '',
    experience: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/doctors/register', formData);
      navigate('/doctor/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 3 }}>
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <PersonAddAltIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Doctor Registration
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField name="name" label="Full Name" value={formData.name} onChange={handleChange} required autoFocus />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="speciality" label="Speciality" value={formData.speciality} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="experience" label="Experience (years)" type="number" value={formData.experience} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField name="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField name="password" label="Password" type="password" value={formData.password} onChange={handleChange} required />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Box textAlign="center">
            <Link href="/doctor/login" variant="body2">
              {"Already have an account? Sign In"}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default DoctorRegister;