const { Router } = require('express');
const router = Router();

const { login, register, verifyOTP, resendOTP, forgotPassword, resetPassword, setup2FA, enable2FA, disable2FA, verify2FA } = require('../controllers/auth');
const { authenticateToken } = require('../middleware/auth');

router.post('/login', login);
router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.post('/2fa/setup', authenticateToken, setup2FA);
router.post('/2fa/enable', authenticateToken, enable2FA);
router.post('/2fa/disable', authenticateToken, disable2FA);
router.post('/2fa/verify', verify2FA);

module.exports = router;