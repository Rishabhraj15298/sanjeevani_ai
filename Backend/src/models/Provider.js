const mongoose = require('mongoose');

const ProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  speciality: { type: String, default: 'General Physician' },
  phone: String,
  address: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere', required: true } // [lon, lat]
  }
}, { timestamps: true });

module.exports = mongoose.model('Provider', ProviderSchema);
