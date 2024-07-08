const { Router } = require('express');
const router = Router();

const { getUsers, createUser, deleteUser } = require('../controllers/subusers');

const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, getUsers);
router.post('/', authMiddleware, createUser);
router.delete('/:userId', authMiddleware, deleteUser);

module.exports = router;