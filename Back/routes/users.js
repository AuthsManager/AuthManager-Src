const { Router } = require('express');
const router = Router();

const { getMe } = require('../controllers/users');
const { getLicenses, createLicense, renewLicense, deleteLicense } = require('../controllers/licenses');

const authMiddleware = require('../middleware/auth');

router.get('/@me', authMiddleware, getMe);
router.get('/licenses', authMiddleware, getLicenses);
router.post('/licenses', authMiddleware, createLicense);
router.patch('/licenses/:licenseId', authMiddleware, renewLicense);
router.delete('/licenses/:licenseId', authMiddleware, deleteLicense);

module.exports = router;