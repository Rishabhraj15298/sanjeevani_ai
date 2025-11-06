const router = require('express').Router();
const auth = require('../middleware/auth');
const permit = require('../middleware/roles');
const ctrl = require('../controllers/doctorController');

router.use(auth, permit('doctor', 'admin'));

router.get('/pending', ctrl.listPendingReports);
router.post('/approve/:id', ctrl.approveReport);
router.post('/reject/:id', ctrl.rejectReport);

module.exports = router;
