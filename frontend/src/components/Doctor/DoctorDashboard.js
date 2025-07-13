import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Container, Typography, Paper, Grid, TextField, Button, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  FormGroup, FormControlLabel, Checkbox, Box, AppBar, Toolbar, IconButton
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import UpdateIcon from '@mui/icons-material/Update';
import EventIcon from '@mui/icons-material/Event';
import HistoryIcon from '@mui/icons-material/History';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import moment from 'moment';

// Subtle SVG background pattern
const backgroundPattern = `url('data:image/svg+xml,%3Csvg width="52" height="26" viewBox="0 0 52 26" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23d4d4d4" fill-opacity="0.1"%3E%3Cpath d="M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6H10zM42 24c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6h-2c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h-2zM10 24c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6H10z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`;

function DoctorDashboard() {
  const [availability, setAvailability] = useState({ city: '', state: '', schedule: {} });
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const navigate = useNavigate();

  const doctorToken = localStorage.getItem('doctorToken');

  const handleLogout = () => {
    localStorage.removeItem('doctorToken');
    navigate('/');
  };

  const nextSevenDays = useMemo(() => Array.from({ length: 7 }, (_, i) =>
    moment().add(i, 'days').format('YYYY-MM-DD')
  ), []);

  const timeSlots = useMemo(() => [
    { id: 'slot1', label: '11am-1pm' },
    { id: 'slot2', label: '3pm-5pm' },
    { id: 'slot3', label: '5pm-7pm' }
  ], []);

  const fetchDoctorProfile = useCallback(async () => {
    try {
      const res = await api.get('/doctors/profile', { headers: { Authorization: `Bearer ${doctorToken}` } });
      setDoctorName(res.data.name);
      setAvailability({
        city: res.data.city || '',
        state: res.data.state || '',
        schedule: res.data.schedule || {}
      });
    } catch (err) { console.error('Failed to fetch doctor profile', err); }
  }, [doctorToken]);

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await api.get('/doctors/appointments', { headers: { Authorization: `Bearer ${doctorToken}` } });
      setAppointments(res.data.appointments);
    } catch (err) { console.error('Failed to fetch appointments', err); }
  }, [doctorToken]);

  useEffect(() => {
    fetchDoctorProfile();
    fetchAppointments();
  }, [fetchDoctorProfile, fetchAppointments]);

  const handleChange = (e) => {
    setAvailability({ ...availability, [e.target.name]: e.target.value });
  };

  const handleAvailabilityChange = (date, slot, checked) => {
    setAvailability(prev => {
      const newSchedule = { ...prev.schedule };
      if (!newSchedule[date]) newSchedule[date] = [];
      if (checked) {
        if (!newSchedule[date].includes(slot)) newSchedule[date].push(slot);
      } else {
        newSchedule[date] = newSchedule[date].filter(s => s !== slot);
      }
      return { ...prev, schedule: newSchedule };
    });
  };

  const updateAvailability = async () => {
    try {
      await api.post('/doctors/availability', availability, { headers: { Authorization: `Bearer ${doctorToken}` } });
      setMessage('Availability updated successfully.');
    } catch (err) {
      setMessage('Failed to update availability.');
    }
  };

  const { upcomingAppointments, pastAppointments } = useMemo(() => {
    const today = moment().startOf('day');
    const upcoming = [];
    const past = [];
    appointments.forEach(app => {
      const appDate = moment(app.date, 'YYYY-MM-DD');
      if (appDate.isSameOrAfter(today)) upcoming.push(app);
      else past.push(app);
    });
    return { upcomingAppointments: upcoming, pastAppointments: past };
  }, [appointments]);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      // New background style
      background: `linear-gradient(to bottom, #f4f6f8, #eef2f6), ${backgroundPattern}` 
    }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Doctor Dashboard
          </Typography>
          <Typography sx={{ mr: 2 }}>Welcome, Dr. {doctorName}</Typography>
          <IconButton color="inherit" onClick={handleLogout} aria-label="logout">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        {message && <Alert severity="info" sx={{ mb: 3 }} onClose={() => setMessage('')}>{message}</Alert>}

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <UpdateIcon color="primary" sx={{ mr: 1 }}/>
                  <Typography variant="h5" >Update Your Details</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="City" name="city" value={availability.city} onChange={handleChange} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="State" name="state" value={availability.state} onChange={handleChange} required />
                </Grid>
              </Grid>
              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Select Available Time Slots:</Typography>
              {nextSevenDays.map(date => (
                <Box key={date} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">{moment(date).format('dddd, MMMM Do')}</Typography>
                  <FormGroup row>
                    {timeSlots.map(slot => (
                      <FormControlLabel
                        key={`${date}-${slot.id}`}
                        control={
                          <Checkbox
                            checked={availability.schedule[date]?.includes(slot.label) || false}
                            onChange={e => handleAvailabilityChange(date, slot.label, e.target.checked)}
                          />
                        }
                        label={slot.label}
                      />
                    ))}
                  </FormGroup>
                </Box>
              ))}
              <Button variant="contained" onClick={updateAvailability} sx={{ mt: 2 }}>
                Update Availability
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EventIcon color="primary" sx={{ mr: 1 }}/>
                  <Typography variant="h5">Upcoming Appointments</Typography>
              </Box>
              {upcomingAppointments.length > 0 ? (
                <AppointmentsTable appointments={upcomingAppointments} />
              ) : (
                <EmptyState message="No upcoming appointments."/>
              )}
            </Paper>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <HistoryIcon color="primary" sx={{ mr: 1 }}/>
                  <Typography variant="h5">Past Appointments</Typography>
              </Box>
              {pastAppointments.length > 0 ? (
                <AppointmentsTable appointments={pastAppointments} />
              ) : (
                <EmptyState message="No past appointments."/>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

const AppointmentsTable = ({ appointments }) => (
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Time</TableCell>
          <TableCell>Patient Name</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {appointments.map(app => (
          <TableRow key={app._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell>{moment(app.date).format('LL')}</TableCell>
            <TableCell>{app.time}</TableCell>
            <TableCell>{app.patientName}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const EmptyState = ({ message }) => (
    <Box textAlign="center" p={3}>
        <EventBusyIcon sx={{ fontSize: 48, color: 'grey.400' }} />
        <Typography color="text.secondary">{message}</Typography>
    </Box>
);

export default DoctorDashboard;