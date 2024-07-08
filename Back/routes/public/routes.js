const { Router } = require('express');
const router = Router();

const { checkApp, register, login } = require('../../controllers/public/auth');

router.post('/initiate', checkApp);
router.post('/register', register);
router.post('/login', login);

module.exports = router;