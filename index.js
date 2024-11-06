const express = require('express');
const app = express();
const PORT = 3000;

// Ruta de ejemplo
app.get('/', (req, res) => {
    res.send('¡Hola, mundo desde Express!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
