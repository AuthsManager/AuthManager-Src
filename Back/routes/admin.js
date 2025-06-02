const { Router } = require('express');
const router = Router();

const { getUsers, createUser, deleteUser } = require('../controllers/admin/users');

const authMiddleware = require('../middleware/auth');

router.get('/users', authMiddleware, getUsers);
router.post('/users', authMiddleware, createUser);
router.delete('/users/:userId', authMiddleware, deleteUser);

module.exports = router;