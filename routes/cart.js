const express = require('express');
const { addToCart, getCart, updateCart, removeFromCart } = require('../controllers/cartController');
const authenticate = require('../middleware/authenticate'); // Middleware de autenticación

const router = express.Router();

// Rutas del carrito protegidas por el middleware
router.post('/', authenticate, addToCart); // Agregar al carrito
router.get('/', authenticate, getCart); // Obtener el carrito
router.put('/:id', authenticate, updateCart); // Actualizar cantidad en el carrito
router.delete('/:id', authenticate, removeFromCart); // Eliminar del carrito

module.exports = router;
