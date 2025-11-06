const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/providerController');

router.use(auth); // both patient & doctor can call

router.get('/nearby', ctrl.nearby);
router.post('/seed-demo', ctrl.seedDemo); // optional (doctor/admin guarded inside)

module.exports = router;
