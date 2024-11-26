const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Verificar que las variables de entorno se cargaron correctamente
console.log('Variables de entorno cargadas:');
console.log('PORT:', process.env.PORT);
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Cargada correctamente' : 'Falta JWT_SECRET');

// Configuración de la base de datos
const pool = new Pool({
    connectionString: process.env.SUPABASE_URL,
    ssl: { rejectUnauthorized: false }
});

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

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
