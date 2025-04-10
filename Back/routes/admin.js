const { Router } = require('express');
const router = Router();

const { getUsers, createUser } = require('../controllers/admin/users');

const authMiddleware = require('../middleware/auth');

router.get('/users', authMiddleware, getUsers);
router.post('/users', authMiddleware, createUser);

module.exports = router;