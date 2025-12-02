const prisma = require('../config/prisma');
const sanitize = require('../utils/sanitizer');

exports.getCart = async (req, res) => {
    try {
        let cart = await prisma.cart.findFirst({
            where: { userId: req.user.id },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: req.user.id },
                include: { items: { include: { product: true } } }
            });
        }

        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching cart' });
    }
};

exports.uploadCartFiles = (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }
        const urls = req.files.map(file => file.path);
        res.json({ urls });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Error uploading files' });
    }
};

exports.addItemToCart = async (req, res) => {
    try {
        let { productId, quantity, customization } = req.body;

        if (customization) {
            customization = sanitize(customization);
        }

        let cart = await prisma.cart.findFirst({
            where: { userId: req.user.id }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId: req.user.id }
            });
        }

        const existingItems = await prisma.cartItem.findMany({
            where: {
                cartId: cart.id,
                productId: parseInt(productId)
            }
        });

        const customizationStr = customization ? JSON.stringify(customization) : null;
        const existingItem = existingItems.find(item => item.customization === customizationStr);

        if (existingItem) {
            const updated = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + parseInt(quantity) },
                include: { product: true }
            });
            res.json(updated);
        } else {
            const cartItem = await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: parseInt(productId),
                    quantity: parseInt(quantity),
                    customization: customizationStr
                },
                include: { product: true }
            });
            res.json(cartItem);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding item to cart' });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;

        const cartItem = await prisma.cartItem.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { cart: true }
        });

        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        if (cartItem.cart.userId !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const updatedItem = await prisma.cartItem.update({
            where: { id: parseInt(req.params.id) },
            data: { quantity: parseInt(quantity) },
            include: { product: true }
        });

        res.json(updatedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating cart item' });
    }
};

exports.removeCartItem = async (req, res) => {
    try {
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { cart: true }
        });

        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        if (cartItem.cart.userId !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        await prisma.cartItem.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error removing item from cart' });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const cart = await prisma.cart.findFirst({
            where: { userId: req.user.id }
        });

        if (cart) {
            await prisma.cartItem.deleteMany({
                where: { cartId: cart.id }
            });
        }

        res.json({ message: 'Cart cleared' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error clearing cart' });
    }
};
