const { Router } = require('express');
const router = Router();

const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/admin/users');
const { getLicenses, createLicense, renewLicense, deleteLicense } = require('../controllers/licenses');
const { getApps, createApp, renameApp, deleteApp } = require('../controllers/apps');

const authMiddleware = require('../middleware/auth');

router.get('/users', authMiddleware, getUsers);
router.post('/users', authMiddleware, createUser);
router.put('/users/:userId', authMiddleware, updateUser);
router.delete('/users/:userId', authMiddleware, deleteUser);

router.get('/licenses', authMiddleware, getLicenses);
router.post('/licenses', authMiddleware, createLicense);
router.patch('/licenses/:licenseId', authMiddleware, renewLicense);
router.delete('/licenses/:licenseId', authMiddleware, deleteLicense);

router.get('/apps', authMiddleware, getApps);
router.post('/apps', authMiddleware, createApp);
router.patch('/apps/:appId', authMiddleware, renameApp);
router.delete('/apps/:appId', authMiddleware, deleteApp);

module.exports = router;