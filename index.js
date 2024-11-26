const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/auth'); // Rutas de autenticación
const productRoutes = require('./routes/products'); // Rutas de productos
const cartRoutes = require('./routes/cart'); // Rutas del carrito

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

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
