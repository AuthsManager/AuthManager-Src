const { Router } = require('express');
const router = Router();

const { createApp, editApp, deleteApp } = require('../controllers/apps');

const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, createApp);
router.patch('/:appId', authMiddleware, editApp);
router.delete('/:appId', authMiddleware, deleteApp);

module.exports = router;