const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');
const dotenv = require('dotenv');
dotenv.config();

// Patient registration
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let patient = await Patient.findOne({ email });
    if (patient) {
      return res.status(400).json({ msg: 'Patient already exists' });
    }
    patient = new Patient({ name, email, password });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    patient.password = await bcrypt.hash(password, salt);
    
    await patient.save();
    res.status(201).json({ msg: 'Patient registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Patient login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const payload = {
      id: patient._id,
      role: 'patient'
    };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, name: patient.name });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get appointments for patient (requires patient auth)
router.get('/appointments', auth('patient'), async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id }).populate('doctor', 'name');
    const formattedAppointments = appointments.map(app => ({
      _id: app._id,
      date: app.date,
      time: app.time,
      doctorName: app.doctor.name
    }));
    res.json({ appointments: formattedAppointments });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
