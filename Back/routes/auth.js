const { Router } = require('express');
const router = Router();

const { login, register, verifyOTP, resendOTP } = require('../controllers/auth');

router.post('/login', login);
router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

module.exports = router;