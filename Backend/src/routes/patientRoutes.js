const router = require('express').Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const permit = require('../middleware/roles');
const ctrl = require('../controllers/patientController');

router.use(auth, permit('patient'));

router.post(
  '/reading',
  [
    body('systolic').isNumeric(),
    body('diastolic').isNumeric(),
    body('pulse').optional().isNumeric(),
    body('symptoms').optional().isArray(),
    body('measuredAt').optional().isISO8601(),
    body('notes').optional().isString()
  ],
  ctrl.addReading
);

router.get('/readings', ctrl.getReadings);
router.get('/ai-reports', ctrl.getAIReports);
router.get('/approved-reports', ctrl.getApprovedReports);

module.exports = router;
