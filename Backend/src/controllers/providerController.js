const Provider = require('../models/Provider');

exports.nearby = async (req, res, next) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);
    const speciality = (req.query.speciality || '').trim();
    const km = Math.min(50, parseFloat(req.query.km || '10')); // max 50km

    if (Number.isNaN(lat) || Number.isNaN(lon))
      return res.status(400).json({ message: 'lat/lon required' });

    const query = {
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lon, lat] },
          $maxDistance: km * 1000
        }
      }
    };
    if (speciality) query.speciality = new RegExp(`^${speciality}$`, 'i');

    const docs = await Provider.find(query).limit(30).lean();
    res.json({ providers: docs });
  } catch (e) { next(e); }
};

// optional: demo seed (for hackathon)
exports.seedDemo = async (req, res, next) => {
  try {
    // simple guard: only doctor/admin can seed
    if (!['doctor','admin'].includes(req.user?.role)) return res.status(403).json({ message: 'Forbidden' });

    const sample = [
      { name: 'Dr. A. Verma', speciality: 'Cardiologist', phone: '+91-99999-11111', address: 'MP Nagar', location: { type:'Point', coordinates:[77.4126, 23.2335] } },
      { name: 'Dr. N. Rao', speciality: 'General Physician', phone: '+91-88888-22222', address: 'TT Nagar', location: { type:'Point', coordinates:[77.3940, 23.2317] } },
      { name: 'Apollo Clinic', speciality: 'Multi-speciality', phone: '+91-77777-33333', address: 'Bairagarh', location: { type:'Point', coordinates:[77.3353, 23.2703] } },
      { name: 'City Heart Care', speciality: 'Cardiologist', phone: '+91-91234-56789', address: 'Arera Colony', location: { type:'Point', coordinates:[77.3981, 23.1996] } }
    ];
    await Provider.deleteMany({});
    const out = await Provider.insertMany(sample);
    res.json({ ok: true, count: out.length });
  } catch (e) { next(e); }
};
