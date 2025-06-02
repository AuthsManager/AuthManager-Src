const { Router } = require('express');
const router = Router();

const { getUsers, createUser, deleteUser } = require('../controllers/admin/users');
const { getLicenses, createLicense, renewLicense, deleteLicense } = require('../controllers/licenses');

const authMiddleware = require('../middleware/auth');

router.get('/users', authMiddleware, getUsers);
router.post('/users', authMiddleware, createUser);
router.delete('/users/:userId', authMiddleware, deleteUser);

router.get('/licenses', authMiddleware, getLicenses);
router.post('/licenses', authMiddleware, createLicense);
router.patch('/licenses/:licenseId', authMiddleware, renewLicense);
router.delete('/licenses/:licenseId', authMiddleware, deleteLicense);

module.exports = router;