const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const authenticateToken = require('../middlewares/auth');

// Rutas protegidas
router.get('/', authenticateToken, usuariosController.getUsuarios);
router.put('/:id', authenticateToken, usuariosController.updateUsuario); // Modificar usuario
router.delete('/:id', authenticateToken, usuariosController.deleteUsuario); // Eliminar usuario

// Rutas públicas
router.post('/register', usuariosController.registerUsuario);
router.post('/login', usuariosController.loginUsuario);

module.exports = router;
