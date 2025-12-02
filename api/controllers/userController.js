const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const { validatePassword } = require('../utils/validation');
const sanitize = require('../utils/sanitizer');

exports.getAllUsers = async (req, res) => {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Not authorized' });
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, username: true, firstName: true, lastName: true, role: true, createdAt: true }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(req.params.id) },
            select: { id: true, email: true, username: true, firstName: true, lastName: true, role: true, createdAt: true }
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
};

exports.checkUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await prisma.user.findFirst({
            where: { username: username }
        });
        res.json({ available: !user });
    } catch (error) {
        res.status(500).json({ error: 'Error checking username' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        if (req.user.id !== userId && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Not authorized to update this profile' });
        }

        const { firstName, lastName, email, phone, company, address, city, zipCode, country, username } = sanitize(req.body);

        if (username) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    username: username,
                    NOT: {
                        id: userId
                    }
                }
            });
            if (existingUser) {
                return res.status(400).json({ error: 'Username already taken' });
            }
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { firstName, lastName, email, phone, company, address, city, zipCode, country, username }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = parseInt(req.params.id);

        if (req.user.id !== userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid current password' });
        }

        if (!validatePassword(newPassword)) {
            return res.status(400).json({
                error: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating password' });
    }
};
