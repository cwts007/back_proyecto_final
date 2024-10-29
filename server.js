const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
require('dotenv').config();
const usuariosRoutes = require('./routes/usuarios'); // Importa las rutas de usuarios

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/usuarios', usuariosRoutes);

// Ruta para la raíz
app.get('/', (req, res) => {
    res.send('Bienvenido a la API de BackRepoStock.');
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack); // Log de errores en la consola
    res.status(500).send('Algo salió mal, por favor intenta de nuevo más tarde.'); // Mensaje de error al usuario
});

// Exporta la aplicación envuelta en serverless-http
module.exports = app;
module.exports.handler = serverless(app);
