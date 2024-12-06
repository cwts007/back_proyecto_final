const supabase = require('../db');

// Agregar producto al carrito
exports.addToCart = async (req, res) => {
    const productId = parseInt(req.body.productId, 10);
    const quantity = parseInt(req.body.quantity, 10);
    const userId = parseInt(req.user.id, 10);

    if (isNaN(productId) || isNaN(quantity) || isNaN(userId)) {
        return res.status(400).json({ message: 'Datos inválidos.' });
    }

    try {
        // Verificar si el producto ya está en el carrito
        const { data: existingCartItem, error: fetchError } = await supabase
            .from('cart')
            .select('*')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error al buscar producto en el carrito:', fetchError);
            return res.status(500).json({ message: 'Error al buscar producto en el carrito.' });
        }

        if (existingCartItem) {
            // Si ya está en el carrito, actualiza la cantidad
            const newQuantity = existingCartItem.quantity + quantity;
            const { error: updateError } = await supabase
                .from('cart')
                .update({ quantity: newQuantity })
                .eq('id', existingCartItem.id);

            if (updateError) {
                console.error('Error al actualizar la cantidad del producto:', updateError);
                return res.status(500).json({ message: 'Error al actualizar la cantidad del producto en el carrito.' });
            }

            return res.status(200).json({ message: 'Cantidad del producto actualizada en el carrito.' });
        }

        // Si no está en el carrito, agregarlo
        const { data: newCartItem, error: insertError } = await supabase
            .from('cart')
            .insert([{ user_id: userId, product_id: productId, quantity }])
            .select()
            .single();

        if (insertError) {
            console.error('Error al agregar producto al carrito:', insertError);
            return res.status(500).json({ message: 'Error al agregar producto al carrito.' });
        }

        res.status(201).json({ message: 'Producto agregado al carrito.', cartItem: newCartItem });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error.message);
        res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
};

// Obtener contenido del carrito
exports.getCart = async (req, res) => {
    const userId = parseInt(req.user.id, 10);

    if (isNaN(userId)) {
        return res.status(400).json({ message: 'ID de usuario inválido.' });
    }

    try {
        const { data: cartItems, error } = await supabase
            .from('cart')
            .select(`
                id, 
                product_id, 
                quantity, 
                products (
                    name, 
                    description, 
                    price
                )
            `)
            .eq('user_id', userId);

        if (error) {
            console.error('Error al obtener el contenido del carrito:', error);
            return res.status(500).json({ message: 'Error al obtener el contenido del carrito.' });
        }

        res.status(200).json(cartItems);
    } catch (error) {
        console.error('Error al procesar la solicitud:', error.message);
        res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
};

// Eliminar producto del carrito
exports.removeFromCart = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const userId = parseInt(req.user.id, 10);

    if (isNaN(id) || isNaN(userId)) {
        return res.status(400).json({ message: 'Datos inválidos.' });
    }

    try {
        const { error } = await supabase
            .from('cart')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) {
            console.error('Error al eliminar producto del carrito:', error);
            return res.status(500).json({ message: 'Error al eliminar producto del carrito.' });
        }

        res.status(200).json({ message: 'Producto eliminado del carrito.' });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error.message);
        res.status(500).json({ message: 'Error al procesar la solicitud.' });
    }
};
