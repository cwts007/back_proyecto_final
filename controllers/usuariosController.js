const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Obtener todos los usuarios
exports.getUsuarios = async (req, res) => {
    try {
        const { data, error } = await supabase.from('usuarios').select('*');
        if (error) throw error;
        res.json(data);  // Devuelve los usuarios obtenidos, o un array vacío si no hay usuarios
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

// Registrar un nuevo usuario
exports.registerUsuario = async (req, res) => {
    const { nombre, apellido, rut, correo, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from('usuarios')
            .insert([{ nombre, apellido, rut, correo, password_hash: hashedPassword }])
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        console.error('Error al registrar usuario:', error.message);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

// Iniciar sesión de usuario
exports.loginUsuario = async (req, res) => {
    const { correo, password } = req.body;
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('correo', correo)
            .single();

        if (error || !data) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const usuario = data;
        const isPasswordValid = await bcrypt.compare(password, usuario.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

// Modificar un usuario
exports.updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, rut, correo, password } = req.body;

    try {
        const updateData = { nombre, apellido, rut, correo };

        // Si se envía una nueva contraseña, actualizarla con hash
        if (password) {
            updateData.password_hash = await bcrypt.hash(password, 10);
        }

        const { data, error } = await supabase
            .from('usuarios')
            .update(updateData)
            .eq('id', id)
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Error al actualizar usuario:', error.message);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};

// Eliminar un usuario
exports.deleteUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('usuarios')
            .delete()
            .eq('id', id)
            .single();

        if (error) throw error;
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error.message);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};
