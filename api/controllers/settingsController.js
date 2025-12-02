const prisma = require('../config/prisma');
const sanitize = require('../utils/sanitizer');

exports.getSettings = async (req, res) => {
    try {
        let settings = await prisma.settings.findFirst();
        if (!settings) {
            settings = await prisma.settings.create({
                data: {
                    shippingCost: 5.00,
                    taxRate: 0.20,
                    currency: 'EUR'
                }
            });
        }
        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Error fetching settings' });
    }
};

exports.updateSettings = async (req, res) => {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Not authorized' });

    try {
        const { shippingCost, taxRate, currency } = sanitize(req.body);

        let settings = await prisma.settings.findFirst();

        if (!settings) {
            settings = await prisma.settings.create({
                data: {
                    shippingCost: parseFloat(shippingCost),
                    taxRate: parseFloat(taxRate),
                    currency
                }
            });
        } else {
            settings = await prisma.settings.update({
                where: { id: settings.id },
                data: {
                    shippingCost: parseFloat(shippingCost),
                    taxRate: parseFloat(taxRate),
                    currency
                }
            });
        }

        res.json(settings);
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: 'Error updating settings' });
    }
};
