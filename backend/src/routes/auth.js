const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { validateLogin } = require('../middleware/validation');

// Routes publiques
router.post('/login', validateLogin, AuthController.login);
router.post('/logout', AuthController.logout);

// Routes protégées
router.get('/me', verifyToken, AuthController.me);

module.exports = router;
