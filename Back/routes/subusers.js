const { Router } = require('express');
const router = Router();

const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/subusers');

const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getUsers);
router.post('/', authMiddleware, createUser);
router.put('/:userId', authMiddleware, updateUser);
router.delete('/:userId', authMiddleware, deleteUser);

module.exports = router;