const { Router } = require('express');
const router = Router();

const { login, register, verifyOTP, resendOTP, forgotPassword, resetPassword } = require('../controllers/auth');

router.post('/login', login);
router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;