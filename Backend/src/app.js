const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);

// central error handler
app.use((err, req, res, next) => {
  console.error('❗', err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

module.exports = app;
