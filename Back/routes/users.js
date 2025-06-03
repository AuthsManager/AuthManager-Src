const { Router } = require('express');
const router = Router();

const { getMe, updateSettings, updateProfile, changePassword, sendEmailVerificationCode, verifyEmailCode } = require('../controllers/users');
const { getLicenses, createLicense, renewLicense, deleteLicense } = require('../controllers/licenses');

const authMiddleware = require('../middleware/auth');

router.get('/@me', authMiddleware, getMe);
router.patch('/settings', authMiddleware, updateSettings);
router.patch('/profile', authMiddleware, updateProfile);
router.patch('/password', authMiddleware, changePassword);
router.get('/licenses', authMiddleware, getLicenses);
router.post('/licenses', authMiddleware, createLicense);
router.patch('/licenses/:licenseId', authMiddleware, renewLicense);
router.delete('/licenses/:licenseId', authMiddleware, deleteLicense);
router.post('/send-email', authMiddleware, sendEmailVerificationCode);
router.post('/verify-email', authMiddleware, verifyEmailCode);

module.exports = router;