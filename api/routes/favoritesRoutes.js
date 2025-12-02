const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
    try {
        const favorites = await prisma.savedProduct.findMany({
            where: { userId: req.user.id },
            include: { product: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching favorites' });
    }
});

router.get('/check/:productId', protect, async (req, res) => {
    try {
        const favorite = await prisma.savedProduct.findFirst({
            where: {
                userId: req.user.id,
                productId: parseInt(req.params.productId)
            }
        });
        res.json({ isFavorite: !!favorite });
    } catch (error) {
        res.status(500).json({ error: 'Error checking favorite status' });
    }
});

router.post('/', protect, async (req, res) => {
    try {
        const { productId } = req.body;
        const favorite = await prisma.savedProduct.create({
            data: {
                userId: req.user.id,
                productId: parseInt(productId)
            }
        });
        res.json(favorite);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.json({ message: 'Already favorited' });
        }
        res.status(500).json({ error: 'Error adding to favorites' });
    }
});

router.delete('/:productId', protect, async (req, res) => {
    try {
        await prisma.savedProduct.deleteMany({
            where: {
                userId: req.user.id,
                productId: parseInt(req.params.productId)
            }
        });
        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        res.status(500).json({ error: 'Error removing from favorites' });
    }
});

module.exports = router;
