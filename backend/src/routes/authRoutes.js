const express = require('express');
const router = express.Router();
const { login, logout, getMe } = require('../controllers/authController');
const { protectAdmin } = require('../middleware/authMiddleware');
const { loginLimiter } = require('../middleware/rateLimiter');

router.post('/login', loginLimiter, login);
router.post('/logout', logout);
router.get('/me', protectAdmin, getMe);

module.exports = router;
