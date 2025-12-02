const prisma = require('../config/prisma');
const sanitize = require('../utils/sanitizer');

exports.createChangeRequest = async (req, res) => {
    try {
        const { orderId, changeType, changeDetails } = sanitize(req.body);

        const existingRequest = await prisma.orderChangeRequest.findFirst({
            where: {
                orderId: parseInt(orderId),
                status: 'PENDING'
            }
        });

        if (existingRequest) {
            return res.status(400).json({ error: 'A request is already pending for this order' });
        }

        const changeRequest = await prisma.orderChangeRequest.create({
            data: {
                orderId: parseInt(orderId),
                requestedBy: req.user.id,
                changeType,
                changeDetails: JSON.stringify(changeDetails),
                status: 'PENDING'
            }
        });

        res.json(changeRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating change request' });
    }
};

exports.getAllChangeRequests = async (req, res) => {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Not authorized' });

    try {
        const requests = await prisma.orderChangeRequest.findMany({
            where: { status: 'PENDING' },
            include: {
                order: {
                    include: { user: true, items: { include: { product: true } } }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching change requests' });
    }
};

exports.getChangeRequestsByOrder = async (req, res) => {
    try {
        const orderId = parseInt(req.params.orderId);

        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order) return res.status(404).json({ error: 'Order not found' });

        if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const requests = await prisma.orderChangeRequest.findMany({
            where: {
                orderId: orderId
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching change request' });
    }
};

exports.updateChangeRequest = async (req, res) => {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Not authorized' });

    try {
        const { status, adminNotes } = sanitize(req.body);

        const changeRequest = await prisma.orderChangeRequest.update({
            where: { id: parseInt(req.params.id) },
            data: { status, adminNotes },
            include: { order: true }
        });

        if (status === 'APPROVED' && changeRequest.changeType === 'CANCEL') {
            await prisma.order.update({
                where: { id: changeRequest.orderId },
                data: { status: 'CANCELLED' }
            });
        }

        res.json(changeRequest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating change request' });
    }
};
