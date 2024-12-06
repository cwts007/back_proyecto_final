const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No se proporcionó un token válido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // Convertir el ID del usuario a un entero
        req.user = { ...verified, id: parseInt(verified.id, 10) };
        if (isNaN(req.user.id)) {
            throw new Error('El ID del usuario no es válido.');
        }

        next();
    } catch (error) {
        console.error('Error al verificar el token:', error.message);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'El token ha expirado.' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token no válido.' });
        }

        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
};
