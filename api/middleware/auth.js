const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

const protect = async (req, res, next) => {
    try {
        let token;
        if (req.cookies.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ error: 'Not authorized' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Not authorized' });
    }
};

module.exports = { protect };
