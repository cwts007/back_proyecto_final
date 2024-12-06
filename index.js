const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Ruta principal para verificar que el servidor funciona
app.get('/', (req, res) => {
    res.send('API Backend funcionando correctamente.');
});

// Manejo de errores 404
app.use((req, res, next) => {
    res.status(404).json({ message: 'Recurso no encontrado.' });
});

// Exportar la app para que Vercel la maneje
module.exports = app;
