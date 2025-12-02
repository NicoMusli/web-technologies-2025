const prisma = require('../config/prisma');
const stripe = require('../config/stripe');
const sanitize = require('../utils/sanitizer');

exports.createPaymentIntent = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await prisma.cart.findFirst({
            where: { userId },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        let subtotal = 0;
        for (const item of cart.items) {
            const product = item.product;

            let itemPrice = product.price;
            if (product.onSale && product.discountPercentage) {
                itemPrice = product.price * (1 - product.discountPercentage / 100);
            }

            subtotal += itemPrice * item.quantity;
        }

        let settings = await prisma.settings.findFirst();
        if (!settings) {
            settings = {
                shippingCost: 5.00,
                taxRate: 0.20
            };
        }

        const shipping = subtotal > 0 ? settings.shippingCost : 0;
        const tax = subtotal * settings.taxRate;
        const total = subtotal + shipping + tax;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100),
            currency: 'eur',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                userId: userId.toString(),
                cartId: cart.id.toString()
            }
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: 'Error creating payment intent' });
    }
};

exports.confirmPayment = async (req, res) => {
    try {
        const { orderId, paymentIntentId } = sanitize(req.body);

        const order = await prisma.order.update({
            where: { id: parseInt(orderId) },
            data: {
                paymentId: paymentIntentId,
                status: 'COMPLETED'
            }
        });

        await prisma.payment.update({
            where: { orderId: order.id },
            data: {
                amount: order.total,
                currency: 'EUR',
                stripePaymentId: paymentIntentId,
                status: 'SUCCEEDED'
            }
        });

        res.json({ success: true, order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error confirming payment' });
    }
};

exports.getAllPayments = async (req, res) => {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Not authorized' });
    try {
        const payments = await prisma.payment.findMany({
            include: { order: { include: { user: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching payments' });
    }
};
