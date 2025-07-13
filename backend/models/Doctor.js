const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  speciality: { type: String, required: true },
  experience: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  city: { type: String },
  state: { type: String },
  schedule: { type: Object } // e.g., { "2025-03-05": ["11am-1pm", "3pm-5pm"] }
});

module.exports = mongoose.model('Doctor', DoctorSchema);
