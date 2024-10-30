const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Obtener todos los usuarios
exports.getUsuarios = async (req, res) => {
    try {
        console.log("Intentando obtener todos los usuarios");
        const { data, error } = await supabase.from('usuarios').select('*');
        if (error) {
            console.error("Error en la consulta de supabase:", error);
            throw new Error("Error al consultar usuarios en la base de datos");
        }
        console.log("Usuarios obtenidos correctamente:", data);
        res.json(data);
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

// Registrar un nuevo usuario
exports.registerUsuario = async (req, res) => {
    const { nombre, apellido, rut, correo, password, tipo } = req.body;
    try {
        console.log("Intento de registro de usuario:", { nombre, apellido, rut, correo, tipo });

        // Verifica si el `rut` ya existe
        const { data: existingUser, error: checkError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('rut', rut)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            console.error("Error al verificar existencia de rut:", checkError);
            return res.status(500).json({ error: 'Error interno al verificar el rut' });
        }

        if (existingUser) {
            console.warn("Intento de registro con rut duplicado:", rut);
            return res.status(400).json({ error: `El rut ${rut} ya está registrado` });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Contraseña encriptada");

        const { data, error } = await supabase
            .from('usuarios')
            .insert([{ nombre, apellido, rut, correo, password_hash: hashedPassword, tipo }])
            .single();

        if (error) {
            console.error("Error en la inserción de usuario:", error);
            throw new Error("Error al insertar el nuevo usuario en la base de datos");
        }

        console.log("Usuario registrado exitosamente:", data);
        res.status(201).json({ message: "Usuario registrado exitosamente", user: data });
    } catch (error) {
        console.error('Error al registrar usuario:', error.message);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

// Iniciar sesión de usuario
exports.loginUsuario = async (req, res) => {
    const { correo, password } = req.body;
    try {
        console.log("Intentando iniciar sesión para el correo:", correo);
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('correo', correo)
            .single();

        if (error || !data) {
            console.warn("Credenciales inválidas o usuario no encontrado");
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const usuario = data;
        const isPasswordValid = await bcrypt.compare(password, usuario.password_hash);
        if (!isPasswordValid) {
            console.warn("Contraseña inválida para el usuario:", correo);
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log("Inicio de sesión exitoso, token generado");
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
        console.log("Actualizando usuario con ID:", id);
        const updateData = { nombre, apellido, rut, correo };

        if (password) {
            updateData.password_hash = await bcrypt.hash(password, 10);
            console.log("Contraseña encriptada para actualización");
        }

        const { data, error } = await supabase
            .from('usuarios')
            .update(updateData)
            .eq('id', id)
            .single();

        if (error) {
            console.error("Error en la actualización de usuario:", error);
            throw new Error("Error al actualizar el usuario en la base de datos");
        }
        console.log("Usuario actualizado exitosamente:", data);
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
        console.log("Eliminando usuario con ID:", id);
        const { data, error } = await supabase
            .from('usuarios')
            .delete()
            .eq('id', id)
            .single();

        if (error) {
            console.error("Error en la eliminación de usuario:", error);
            throw new Error("Error al eliminar el usuario en la base de datos");
        }
        console.log("Usuario eliminado exitosamente");
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error.message);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};
