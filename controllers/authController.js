const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../db');

// Registrar un nuevo usuario
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        console.log('--- Intentando registrar un usuario ---');
        console.log('Datos recibidos:', { name, email, password });

        // Verificar si el email ya está registrado
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error al verificar el usuario existente:', fetchError);
            return res.status(500).json({ message: 'Error al verificar el usuario existente.' });
        }

        if (existingUser) {
            console.error('El email ya está registrado:', email);
            return res.status(400).json({ message: 'El email ya está registrado.' });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Contraseña encriptada generada:', hashedPassword);

        // Insertar el usuario en la base de datos
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([{ name, email, password: hashedPassword }])
            .select()
            .single();

        if (insertError) {
            console.error('Error al registrar el usuario:', insertError);
            return res.status(500).json({ message: 'Error al registrar el usuario.' });
        }

        console.log('Usuario registrado exitosamente:', newUser);
        res.status(201).json({ message: 'Usuario registrado exitosamente.', user: newUser });
    } catch (error) {
        console.error('Error al registrar el usuario:', error.message);
        res.status(500).json({ message: 'Error al registrar el usuario.' });
    }
};

// Iniciar sesión
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('--- Intentando iniciar sesión ---');
        console.log('Email recibido:', email);

        // Buscar al usuario por email
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (fetchError) {
            console.error('Error al buscar usuario:', fetchError);
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Verificar la contraseña
        console.log('Contraseña almacenada (hash):', user.password);
        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log('¿Contraseña válida?', isValidPassword);

        if (!isValidPassword) {
            console.error('Contraseña incorrecta.');
            return res.status(401).json({ message: 'Contraseña incorrecta.' });
        }

        // Generar un token JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Token generado exitosamente:', token);

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

        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('id, name, email, created_at')
            .eq('id', userId)
            .single();

        if (fetchError) {
            console.error('Error al buscar usuario:', fetchError);
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error.message);
        res.status(500).json({ message: 'Error al obtener el perfil del usuario.' });
    }
};
