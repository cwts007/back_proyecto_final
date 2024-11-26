const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.SUPABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Registrar un nuevo usuario
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        console.log('Registrando nuevo usuario:', { name, email });

        // Verificar si el email ya está registrado
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        console.log('Consulta de usuario existente:', userExists.rows);

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'El email ya está registrado.' });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Contraseña encriptada generada.');

        // Insertar el usuario en la base de datos
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        );

        console.log('Usuario registrado exitosamente:', result.rows[0]);
        res.status(201).json({ message: 'Usuario registrado exitosamente.', user: result.rows[0] });
    } catch (error) {
        console.error('Error al registrar el usuario:', error.message);
        res.status(500).json({ message: 'Error al registrar el usuario.' });
    }
};

// Iniciar sesión
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Intentando iniciar sesión con email:', email);

        // Buscar al usuario por email
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        console.log('Resultado de la consulta de usuario:', user.rows);

        if (user.rows.length === 0) {
            console.error('Usuario no encontrado. Email:', email);
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Verificar la contraseña
        const isValidPassword = await bcrypt.compare(password, user.rows[0].password);
        console.log('¿Contraseña válida?', isValidPassword);

        if (!isValidPassword) {
            console.error('Contraseña incorrecta.');
            return res.status(401).json({ message: 'Contraseña incorrecta.' });
        }

        // Generar un token JWT
        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Token generado:', token);

        res.status(200).json({ message: 'Inicio de sesión exitoso.', token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
        res.status(500).json({ message: 'Error al iniciar sesión.' });
    }
};


// Obtener perfil
exports.getProfile = async (req, res) => {
    const userId = req.user?.id;

    try {
        console.log('Obteniendo perfil para usuario ID:', userId);

        if (!userId) {
            console.error('Token no válido o usuario no autenticado.');
            return res.status(401).json({ message: 'Token no válido o usuario no autenticado.' });
        }

        const user = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [userId]);
        console.log('Resultado de la consulta del perfil:', user.rows);

        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.status(200).json(user.rows[0]);
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error.message);
        res.status(500).json({ message: 'Error al obtener el perfil del usuario.' });
    }
};
