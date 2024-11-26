const express = require('express');
const { addToCart, getCart, removeFromCart } = require('../controllers/cartController');
const authenticate = require('../middleware/authenticate'); // Middleware de autenticación

const router = express.Router();

// Rutas del carrito protegidas por el middleware
router.post('/', authenticate, addToCart);
router.get('/', authenticate, getCart);
router.delete('/:id', authenticate, removeFromCart);

module.exports = router;
