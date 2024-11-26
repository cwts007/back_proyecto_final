const supabase = require('../db');

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*');

        if (error) {
            console.error('Error al obtener productos:', error);
            return res.status(500).json({ message: 'Error al obtener productos.' });
        }

        res.status(200).json(products);
    } catch (error) {
        console.error('Error al procesar la solicitud:', error.message);
        res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
};

// Obtener un producto por ID
exports.getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error al obtener producto:', error);
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error al procesar la solicitud:', error.message);
        res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
};

// Crear un nuevo producto
exports.createProduct = async (req, res) => {
    const { name, description, price } = req.body;

    try {
        const { data: newProduct, error } = await supabase
            .from('products')
            .insert([{ name, description, price }])
            .select()
            .single();

        if (error) {
            console.error('Error al crear producto:', error);
            return res.status(500).json({ message: 'Error al crear producto.' });
        }

        res.status(201).json({ message: 'Producto creado exitosamente.', product: newProduct });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error.message);
        res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
};

// Actualizar un producto
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;

    try {
        const { error } = await supabase
            .from('products')
            .update({ name, description, price })
            .eq('id', id);

        if (error) {
            console.error('Error al actualizar producto:', error);
            return res.status(500).json({ message: 'Error al actualizar producto.' });
        }

        res.status(200).json({ message: 'Producto actualizado exitosamente.' });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error.message);
        res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error al eliminar producto:', error);
            return res.status(500).json({ message: 'Error al eliminar producto.' });
        }

        res.status(200).json({ message: 'Producto eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error.message);
        res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
};
