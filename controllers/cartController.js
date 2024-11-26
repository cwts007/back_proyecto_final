const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.SUPABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Agregar un producto al carrito
exports.addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = cart.quantity + $3 RETURNING *',
            [userId, productId, quantity]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar el producto al carrito.' });
    }
};

// Obtener el carrito de un usuario
exports.getCartByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await pool.query(
            'SELECT c.id, p.name, p.price, c.quantity FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1',
            [userId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el carrito.' });
    }
};

// Eliminar un producto del carrito
exports.removeFromCart = async (req, res) => {
    const { userId, productId } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM cart WHERE user_id = $1 AND product_id = $2 RETURNING *',
            [userId, productId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito.' });
        }
        res.status(200).json({ message: 'Producto eliminado del carrito.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto del carrito.' });
    }
};

// Vaciar el carrito
exports.clearCart = async (req, res) => {
    const { userId } = req.params;

    try {
        await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);
        res.status(200).json({ message: 'Carrito vaciado exitosamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al vaciar el carrito.' });
    }
};
