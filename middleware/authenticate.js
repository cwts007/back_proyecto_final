const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log('Encabezado Authorization recibido:', authHeader);

    if (!authHeader) {
        console.error('No se proporcionó un token.');
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extraído:', token);

    if (!token) {
        console.error('Token faltante después de dividir el encabezado.');
        return res.status(401).json({ message: 'Acceso denegado. Token faltante.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token verificado con éxito:', verified);
        req.user = verified;
        next();
    } catch (error) {
        console.error('Error al verificar el token:', error.message);
        return res.status(400).json({ message: 'Token no válido.' });
    }
};
