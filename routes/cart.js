const express = require('express');
const { addToCart, getCartByUser, removeFromCart, clearCart } = require('../controllers/cartController');

const router = express.Router();

// Rutas
router.post('/', addToCart);
router.get('/:userId', getCartByUser);
router.delete('/:userId/:productId', removeFromCart);
router.delete('/:userId', clearCart);

module.exports = router; // Asegúrate de que sea `module.exports`
