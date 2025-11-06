require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const connectDB = require('../src/config/db');

(async () => {
  await connectDB(process.env.MONGO_URI);
  await User.deleteMany({ email: { $in: ['patient@test.com', 'doctor@test.com'] } });

  const patient = await User.create({
    name: 'Patient One',
    email: 'patient@test.com',
    password: 'password123',
    role: 'patient',
    age: 28,
    gender: 'male'
  });

  const doctor = await User.create({
    name: 'Doctor One',
    email: 'doctor@test.com',
    password: 'password123',
    role: 'doctor'
  });

  console.log('Seeded:', { patient: { email: patient.email }, doctor: { email: doctor.email } });
  await mongoose.disconnect();
  process.exit(0);
})();
