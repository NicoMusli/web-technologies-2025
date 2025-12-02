const prisma = require('../config/prisma');
const sanitize = require('../utils/sanitizer');

exports.createOrder = async (req, res) => {
    try {
        let orderData;
        if (req.body.orderData) {
            orderData = JSON.parse(req.body.orderData);
        } else {
            orderData = req.body;
        }

        orderData = sanitize(orderData);

        const { items, shippingAddress, billingAddress, paymentId } = orderData;
        const userId = req.user.id;

        let subtotal = 0;
        const processedItems = [];

        for (const item of items) {
            const productId = item.productId || item.id;
            const product = await prisma.product.findUnique({
                where: { id: productId }
            });

            if (!product) {
                return res.status(400).json({ error: `Product ${productId} not found` });
            }

            let itemPrice = product.price;
            if (product.onSale && product.discountPercentage) {
                itemPrice = product.price * (1 - product.discountPercentage / 100);
            }

            const itemTotal = itemPrice * item.quantity;
            subtotal += itemTotal;

            processedItems.push({
                productId: productId,
                quantity: item.quantity,
                price: itemPrice,
                customization: JSON.stringify(item.customization || {})
            });
        }

        let settings = await prisma.settings.findFirst();
        if (!settings) {
            settings = {
                shippingCost: 5.00,
                taxRate: 0.20
            };
        }

        const shipping = settings.shippingCost;
        const tax = subtotal * settings.taxRate;
        const total = subtotal + shipping + tax;

        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                const match = file.fieldname.match(/item-(\d+)-file/);
                if (match) {
                    const index = parseInt(match[1]);
                    if (processedItems[index]) {
                        const customization = processedItems[index].customization
                            ? JSON.parse(processedItems[index].customization)
                            : {};
                        customization.file = file.path;
                        processedItems[index].customization = JSON.stringify(customization);
                    }
                }
            });
        }

        const order = await prisma.order.create({
            data: {
                userId,
                total: parseFloat(total.toFixed(2)),
                shippingCost: parseFloat(shipping.toFixed(2)),
                taxAmount: parseFloat(tax.toFixed(2)),
                shippingAddress,
                billingAddress,
                paymentId,
                items: {
                    create: processedItems
                },
                payment: {
                    create: {
                        amount: parseFloat(total.toFixed(2)),
                        status: paymentId ? 'SUCCEEDED' : 'PENDING',
                        stripePaymentId: paymentId
                    }
                }
            },
            include: {
                items: true,
                payment: true
            }
        });

        const cart = await prisma.cart.findFirst({ where: { userId } });
        if (cart) {
            await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        }

        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Error creating order' });
    }
};

exports.getAllOrders = async (req, res) => {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Not authorized' });
    try {
        const orders = await prisma.order.findMany({
            include: { user: true, items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching orders' });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);

        if (req.user.role !== 'ADMIN' && req.user.id !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const orders = await prisma.order.findMany({
            where: { userId: userId },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching orders' });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { user: true, items: { include: { product: true } } }
        });
        if (!order) return res.status(404).json({ error: 'Order not found' });

        if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching order' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Not authorized' });
    try {
        const order = await prisma.order.update({
            where: { id: parseInt(req.params.id) },
            data: { status: sanitize(req.body.status) }
        });
        res.json(order);
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: 'Error creating order' });
    }
};
