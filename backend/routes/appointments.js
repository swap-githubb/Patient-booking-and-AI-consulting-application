const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient'); 
const auth = require('../middleware/auth');
const dotenv = require('dotenv');
dotenv.config();

// Create nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Book an appointment (patient only)
router.post('/book', auth('patient'), async (req, res) => {
  const { doctorId, date, time } = req.body;
  try {
    // Retrieve the doctor to check availability
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ msg: 'Doctor not found' });
    }
    
    // Check if the doctor has marked this time slot as available
    if (!doctor.schedule || !doctor.schedule[date] || !doctor.schedule[date].includes(time)) {
      return res.status(400).json({ msg: 'Selected time slot is not available' });
    }
    
    // Check if the appointment slot is already booked
    const existingAppointment = await Appointment.findOne({ doctor: doctorId, date, time });
    if (existingAppointment) {
      return res.status(400).json({ msg: 'Appointment slot already booked' });
    }
    
    // Create and save the appointment
    const appointment = new Appointment({
      doctor: doctorId,
      patient: req.user.id,
      date,
      time
    });
    await appointment.save();
    
    // Fetch patient details
    const patient = await Patient.findById(req.user.id);
    
    // Prepare email options
    const mailOptionsDoctor = {
      from: process.env.SMTP_FROM,
      to: doctor.email,
      subject: 'New Appointment Booked',
      text: `Hello Dr. ${doctor.name},
      
An appointment has been booked for ${date} at ${time} by patient ${patient.name}.
      
Regards,
Patient-Booking System`
    };
    
    const mailOptionsPatient = {
      from: process.env.SMTP_FROM,
      to: patient.email,
      subject: 'Appointment Confirmation',
      text: `Hello ${patient.name},
      
Your appointment with Dr. ${doctor.name} has been confirmed for ${date} at ${time}.
      
Regards,
Patient-Booking System`
    };
    
    // Send emails to doctor and patient
    transporter.sendMail(mailOptionsDoctor, (err, info) => {
      if (err) {
        console.error('Error sending email to doctor:', err);
      } else {
        console.log('Email sent to doctor:', info.response);
      }
    });
    
    transporter.sendMail(mailOptionsPatient, (err, info) => {
      if (err) {
        console.error('Error sending email to patient:', err);
      } else {
        console.log('Email sent to patient:', info.response);
      }
    });
    
    res.status(201).json({ msg: 'Appointment booked successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Cancel an appointment (patient only)
router.delete('/:id', auth('patient'), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }
    // Ensure that the appointment belongs to the patient
    if (appointment.patient.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    
    // Get doctor and patient details before deletion
    const doctor = await Doctor.findById(appointment.doctor);
    const patient = await Patient.findById(appointment.patient);
    
    await appointment.deleteOne();
    
    // Prepare cancellation email options
    const cancelMailOptionsDoctor = {
      from: process.env.SMTP_FROM,
      to: doctor.email,
      subject: 'Appointment Cancelled',
      text: `Hello Dr. ${doctor.name},
      
The appointment on ${appointment.date} at ${appointment.time} with patient ${patient.name} has been cancelled.
      
Regards,
Patient-Booking System`
    };
    
    const cancelMailOptionsPatient = {
      from: process.env.SMTP_FROM,
      to: patient.email,
      subject: 'Appointment Cancellation Confirmation',
      text: `Hello ${patient.name},
      
Your appointment with Dr. ${doctor.name} on ${appointment.date} at ${appointment.time} has been cancelled.
      
Regards,
Patient-Booking System`
    };
    
    // Send cancellation emails
    transporter.sendMail(cancelMailOptionsDoctor, (err, info) => {
      if (err) {
        console.error('Error sending cancellation email to doctor:', err);
      } else {
        console.log('Cancellation email sent to doctor:', info.response);
      }
    });
    
    transporter.sendMail(cancelMailOptionsPatient, (err, info) => {
      if (err) {
        console.error('Error sending cancellation email to patient:', err);
      } else {
        console.log('Cancellation email sent to patient:', info.response);
      }
    });
    
    res.json({ msg: 'Appointment cancelled successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//Get booked appointments for a given doctor (patient only)
router.get('/doctor/:doctorId', auth('patient'), async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.params.doctorId });
    res.json({ appointments });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
