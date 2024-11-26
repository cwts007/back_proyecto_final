const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Rutas
router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);

module.exports = router; // Asegúrate de que sea `module.exports`
