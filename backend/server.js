const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { initializeRedis } = require('./config/redis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Initialize Redis
initializeRedis();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/conversation', require('./routes/conversation'));

  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });


// Set Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
