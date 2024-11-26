const express = require('express');
const { register, login, getProfile } = require('../controllers/authController'); // Importar controladores
const authenticate = require('../middleware/authenticate'); // Middleware de autenticación

const router = express.Router();

// Definir rutas
router.post('/register', register); // Ruta para registrar un nuevo usuario
router.post('/login', login); // Ruta para iniciar sesión
router.get('/profile', authenticate, getProfile); // Ruta para obtener el perfil de usuario autenticado

module.exports = router; // Exportar el router
