import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Container, Grid, Card, CardContent, Typography, Button, TextField, Box, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab,
  Dialog, DialogTitle, DialogContent, DialogActions, RadioGroup, FormControlLabel, Radio,
  AppBar, Toolbar, IconButton, CardActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import moment from 'moment';
import LogoutIcon from '@mui/icons-material/Logout';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SearchIcon from '@mui/icons-material/Search';
import EventBusyIcon from '@mui/icons-material/EventBusy';

// Subtle SVG background pattern
const backgroundPattern = `url('data:image/svg+xml,%3Csvg width="52" height="26" viewBox="0 0 52 26" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23d4d4d4" fill-opacity="0.1"%3E%3Cpath d="M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6H10zM42 24c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6h-2c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h-2zM10 24c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6H10z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`;

function PatientDashboard() {
  const [searchCriteria, setSearchCriteria] = useState({ city: '', state: '', speciality: '', name: '' });
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({ date: '', time: '' });
  const [doctorBookedSlots, setDoctorBookedSlots] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState('');
  const [patientName, setPatientName] = useState(''); 
  const [isBookingOpen, setBookingOpen] = useState(false);
  const [appointmentTab, setAppointmentTab] = useState(0);

  const navigate = useNavigate();
  const patientToken = localStorage.getItem('patientToken');


  const handleLogout = () => {
    localStorage.removeItem('patientToken');
    localStorage.removeItem('patientName');
    navigate('/');
  };

  const handleSearchChange = (e) => {
    setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value });
  };

  const searchDoctors = async () => {
    try {
      const res = await api.get('/doctors/search', { params: searchCriteria });
      setDoctors(res.data.doctors);
    } catch (err) { console.error('Search failed', err); }
  };

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await api.get('/patients/appointments', { headers: { Authorization: `Bearer ${patientToken}` } });
      setAppointments(res.data.appointments);
    } catch (err) { console.error('Failed to fetch appointments', err); }
  }, [patientToken]);


  useEffect(() => {
    const name = localStorage.getItem('patientName');
    if (name) {
        setPatientName(name);
    }
    fetchAppointments();
  }, [fetchAppointments]);

  const fetchDoctorBookedSlots = async (doctorId) => {
    try {
      const res = await api.get(`/appointments/doctor/${doctorId}`, { headers: { Authorization: `Bearer ${patientToken}` } });
      const booked = {};
      res.data.appointments.forEach(app => {
        if (!booked[app.date]) booked[app.date] = [];
        booked[app.date].push(app.time);
      });
      setDoctorBookedSlots(booked);
    } catch (err) { console.error('Failed to fetch booked slots', err); }
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingDetails({ date: '', time: '' });
    setDoctorBookedSlots({});
    fetchDoctorBookedSlots(doctor._id);
    setBookingOpen(true);
  };

  const filteredSchedule = useMemo(() => {
    if (!selectedDoctor?.schedule) return [];
    const today = moment().startOf('day');
    const maxDate = moment().add(7, 'days').endOf('day');
    return Object.entries(selectedDoctor.schedule).filter(([dateStr]) => {
      const d = moment(dateStr, 'YYYY-MM-DD');
      return d.isBetween(today, maxDate, 'day', '[]');
    }).sort((a,b) => moment(a[0]).diff(moment(b[0])));
  }, [selectedDoctor]);
  
  const hasAvailableSlots = useMemo(() => {
    return filteredSchedule.some(([date, slots]) => {
      const available = slots.filter(slot => !doctorBookedSlots[date]?.includes(slot));
      return available.length > 0;
    });
  }, [filteredSchedule, doctorBookedSlots]);

  const submitBooking = async () => {
    if (!bookingDetails.date || !bookingDetails.time) {
      setMessage('Please select an available slot.'); return;
    }
    try {
      await api.post('/appointments/book', { doctorId: selectedDoctor._id, ...bookingDetails }, { headers: { Authorization: `Bearer ${patientToken}` } });
      setMessage('Appointment booked successfully.');
      setBookingOpen(false);
      setSelectedDoctor(null);
      fetchAppointments();
    } catch (err) { setMessage(err.response?.data?.msg || 'Failed to book appointment.'); }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      await api.delete(`/appointments/${appointmentId}`, { headers: { Authorization: `Bearer ${patientToken}` } });
      setMessage('Appointment cancelled successfully.');
      fetchAppointments();
    } catch (err) { setMessage('Failed to cancel appointment.'); }
  };

  const { upcomingAppointments, pastAppointments } = useMemo(() => {
    const today = moment().startOf('day');
    const up = [], past = [];
    appointments.forEach(app => {
      const d = moment(app.date, 'YYYY-MM-DD');
      d.isSameOrAfter(today) ? up.push(app) : past.push(app);
    });
    return { upcomingAppointments: up, pastAppointments: past };
  }, [appointments]);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      // New background style
      background: `linear-gradient(to bottom, #f4f6f8, #eef2f6), ${backgroundPattern}` 
    }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Patient Dashboard
          </Typography>
          <Typography sx={{ mr: 2 }}>Welcome, {patientName}</Typography>
          <IconButton color="inherit" onClick={handleLogout} aria-label="logout">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        {message && <Alert severity="info" sx={{ mb: 3 }} onClose={() => setMessage('')}>{message}</Alert>}

        <Paper sx={{ p: 3, mb: 4, borderRadius: 3, background: 'linear-gradient(45deg, #6a1b9a 30%, #ab47bc 90%)', color: 'white' }}>
            <Typography variant="h4" gutterBottom>AI Pre-Consultation</Typography>
            <Typography sx={{ mb: 2 }}>Try our AI virtual doctor to get a preliminary diagnosis report before your actual appointment.</Typography>
            <Button 
                variant="contained"
                size="large"
                startIcon={<PsychologyIcon />}
                onClick={() => navigate('/patient/consultation')}
                sx={{ backgroundColor: 'white', color: 'secondary.dark', '&:hover': { backgroundColor: '#f3e5f5'} }}
            >
                Start AI Consultation
            </Button>
        </Paper>

        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SearchIcon color="action" sx={{ mr: 1 }}/>
            <Typography variant="h5">Find a Doctor</Typography>
          </Box>
          <Grid container spacing={2} alignItems="flex-end">
            {Object.keys(searchCriteria).map(f => (
              <Grid item xs={12} sm={6} md={2.5} key={f}>
                <TextField label={f.charAt(0).toUpperCase() + f.slice(1)} name={f} value={searchCriteria[f]} onChange={handleSearchChange} variant="standard"/>
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={2}>
                <Button variant="contained" onClick={searchDoctors} fullWidth>Search</Button>
            </Grid>
          </Grid>
        </Paper>
        
        {doctors.length > 0 &&
        <Grid container spacing={3} sx={{mb: 4}}>
          {doctors.map(doc => (
            <Grid item xs={12} sm={6} md={4} key={doc._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="div">Dr. {doc.name}</Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">{doc.speciality}</Typography>
                  <Typography variant="body2">
                    Experience: {doc.experience} years<br />
                    Location: {doc.city}, {doc.state}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" startIcon={<EventAvailableIcon />} onClick={() => handleBookAppointment(doc)}>Book Appointment</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        }
        
        {selectedDoctor && (
          <Dialog open={isBookingOpen} onClose={() => setBookingOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Book with Dr. {selectedDoctor.name}</DialogTitle>
            <DialogContent>
              {!hasAvailableSlots ? (
                <Alert severity="warning" sx={{ mt: 2 }}>No available slots for booking in the next 7 days.</Alert>
              ) : (
                <RadioGroup name="slot" value={`${bookingDetails.date}__${bookingDetails.time}`} onChange={e => {
                  const [d, t] = e.target.value.split('__');
                  setBookingDetails({ date: d, time: t });
                }}>
                  {filteredSchedule.map(([date, slots]) => {
                    const avail = slots.filter(s => !doctorBookedSlots[date]?.includes(s));
                    if (!avail.length) return null;
                    return (
                      <Box key={date} sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold">{moment(date).format('dddd, LL')}</Typography>
                        {avail.map(slot => (
                          <FormControlLabel key={`${date}-${slot}`} value={`${date}__${slot}`} control={<Radio />} label={slot} />
                        ))}
                      </Box>
                    );
                  })}
                </RadioGroup>
              )}
            </DialogContent>
            <DialogActions sx={{p: '16px 24px'}}>
              <Button onClick={() => setBookingOpen(false)}>Cancel</Button>
              <Button onClick={submitBooking} disabled={!bookingDetails.date || !hasAvailableSlots} variant="contained">Confirm Booking</Button>
            </DialogActions>
          </Dialog>
        )}

        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom>My Appointments</Typography>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={appointmentTab} onChange={(e, val) => setAppointmentTab(val)} indicatorColor="secondary" textColor="secondary">
              <Tab label={`Upcoming (${upcomingAppointments.length})`} />
              <Tab label={`Past (${pastAppointments.length})`} />
            </Tabs>
          </Box>
          <TabPanel value={appointmentTab} index={0}>
            {upcomingAppointments.length > 0 ? (
              <AppointmentsTable appointments={upcomingAppointments} onCancel={cancelAppointment} />
            ) : <EmptyState message="No upcoming appointments." />}
          </TabPanel>
          <TabPanel value={appointmentTab} index={1}>
            {pastAppointments.length > 0 ? (
              <AppointmentsTable appointments={pastAppointments} />
            ) : <EmptyState message="No past appointments found." />}
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function AppointmentsTable({ appointments, onCancel }) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Doctor</TableCell>
            {onCancel && <TableCell align="right">Action</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map(app => (
            <TableRow key={app._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell>{moment(app.date).format('LL')}</TableCell>
              <TableCell>{app.time}</TableCell>
              <TableCell>Dr. {app.doctorName}</TableCell>
              {onCancel && (
                <TableCell align="right">
                  <Button size="small" variant="outlined" color="error" onClick={() => onCancel(app._id)}>Cancel</Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const EmptyState = ({ message }) => (
    <Box textAlign="center" p={4}>
        <EventBusyIcon sx={{ fontSize: 48, color: 'grey.400' }} />
        <Typography color="text.secondary">{message}</Typography>
    </Box>
);

export default PatientDashboard;