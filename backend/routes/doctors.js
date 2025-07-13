const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');
const { getRedisClient } = require('../config/redis');
const dotenv = require('dotenv');
dotenv.config();

// Doctor registration
router.post('/register', async (req, res) => {
  const { name, speciality, experience, email, password } = req.body;
  try {
    let doctor = await Doctor.findOne({ email });
    if (doctor) {
      return res.status(400).json({ msg: 'Doctor already exists' });
    }
    doctor = new Doctor({ name, speciality, experience, email, password });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    doctor.password = await bcrypt.hash(password, salt);
    
    await doctor.save();
    res.status(201).json({ msg: 'Doctor registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Doctor login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const payload = {
      id: doctor._id,
      role: 'doctor'
    };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//Get Doctor Profile
router.get('/profile', auth('doctor'), async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id).select('-password');
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update availability (requires doctor auth)
router.post('/availability', auth('doctor'), async (req, res) => {
  const { city, state, schedule } = req.body;
  try {
    const doctor = await Doctor.findById(req.user.id);
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }
    doctor.city = city;
    doctor.state = state;
    doctor.schedule = schedule;
    await doctor.save();

    // Invalidate cache for this doctor's location and speciality
    const redisClient = getRedisClient();
    const keysToDelete = await redisClient.keys(`doctors:*${doctor.city}*`);
    const keysToDelete2 = await redisClient.keys(`doctors:*${doctor.state}*`);
    const keysToDelete3 = await redisClient.keys(`doctors:*${doctor.speciality}*`);
    const keysToDelete4 = await redisClient.keys(`doctors:*${doctor.name}*`);
    if(keysToDelete.length > 0) await redisClient.del(keysToDelete);
    if(keysToDelete2.length > 0) await redisClient.del(keysToDelete2);
    if(keysToDelete3.length > 0) await redisClient.del(keysToDelete3);
    if(keysToDelete4.length > 0) await redisClient.del(keysToDelete4);

    res.json({ msg: 'Availability updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get upcoming appointments for doctor (requires doctor auth)
router.get('/appointments', auth('doctor'), async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id }).populate('patient', 'name');
    // Format appointments to include patient name
    const formattedAppointments = appointments.map(app => ({
      _id: app._id,
      date: app.date,
      time: app.time,
      patientName: app.patient.name
    }));
    res.json({ appointments: formattedAppointments });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Search doctors based on filters: city, state, speciality, name
router.get('/search', async (req, res) => {
    const { city, state, speciality, name } = req.query;
    const cacheKey = `doctors:${city || ''}:${state || ''}:${speciality || ''}:${name || ''}`;
    const redisClient = getRedisClient();

    try {
        const cachedDoctors = await redisClient.get(cacheKey);
        if (cachedDoctors) {
            return res.json({ doctors: JSON.parse(cachedDoctors), fromCache: true });
        }

        let filters = {};
        if (city) filters.city = city;
        if (state) filters.state = state;
        if (speciality) filters.speciality = speciality;
        if (name) filters.name = { $regex: name, $options: 'i' };

        const doctors = await Doctor.find(filters);

        // Cache the results for 1 hour (3600 seconds)
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(doctors));

        res.json({ doctors });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;