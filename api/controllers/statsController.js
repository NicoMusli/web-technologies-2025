const prisma = require('../config/prisma');

exports.getAdminStats = async (req, res) => {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Not authorized' });
    try {
        const totalOrders = await prisma.order.count();
        const totalRevenue = await prisma.order.aggregate({ _sum: { total: true } });
        const totalProducts = await prisma.product.count();
        const totalCustomers = await prisma.user.count({ where: { role: 'CLIENT' } });

        res.json({
            totalOrders,
            totalRevenue: totalRevenue._sum.total || 0,
            totalProducts,
            totalCustomers
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching stats' });
    }
};

exports.getClientStats = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);

        if (req.user.role !== 'ADMIN' && req.user.id !== userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const totalOrders = await prisma.order.count({ where: { userId } });
        const activeOrders = await prisma.order.count({ where: { userId, status: 'PENDING' } });

        res.json({ totalOrders, activeOrders });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching stats' });
    }
};
