const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/authController');

router.post(
  '/register',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').optional().isIn(['patient', 'doctor', 'admin'])
  ],
  ctrl.register
);

router.post('/login', ctrl.login);

module.exports = router;
