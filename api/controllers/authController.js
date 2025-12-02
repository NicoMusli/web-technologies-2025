const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { validatePassword } = require('../utils/validation');
const sanitize = require('../utils/sanitizer');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

exports.register = async (req, res) => {
    try {
        const { email: rawEmail, password, firstName, lastName, username: rawUsername } = sanitize(req.body);

        const email = rawEmail ? rawEmail.trim() : '';
        const username = rawUsername ? rawUsername.trim() : '';

        if (!email || !password || !firstName || !lastName || !username) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.includes('@')) {
            return res.status(400).json({ error: 'Email must contain @' });
        }
        if ((email.match(/@/g) || []).length !== 1) {
            return res.status(400).json({ error: 'Email must contain only one @' });
        }
        if (email.includes('@') && !email.split('@')[1].includes('.')) {
            return res.status(400).json({ error: 'Email must contain a dot (.) after @' });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const nameRegex = /^[a-zA-Z\s]*$/;
        if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
            return res.status(400).json({ error: 'Name should not contain special characters' });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({
                error: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
            });
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User with this email or username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                firstName,
                lastName,
                role: 'CLIENT'
            }
        });

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ message: 'User created successfully', userId: user.id, user: { id: user.id, email: user.email, username: user.username, role: user.role, firstName: user.firstName } });
    } catch (error) {
        console.error('Registration error:', error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'User with this email or username already exists' });
        }
        res.status(400).json({ error: 'User already exists or invalid data' });
    }
};

exports.login = async (req, res) => {
    try {
        const { loginIdentifier, password, rememberMe } = sanitize(req.body);

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: { equals: loginIdentifier, mode: 'insensitive' } },
                    { username: { equals: loginIdentifier, mode: 'insensitive' } }
                ]
            }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const expiresIn = rememberMe ? '30d' : '24h';

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        };

        if (rememberMe) {
            cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000;
        }

        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn });

        res.cookie('token', token, cookieOptions);

        res.json({ message: 'Logged in successfully', user: { id: user.id, email: user.email, username: user.username, role: user.role, firstName: user.firstName } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.logout = (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ success: true, data: {} });
};

exports.getMe = async (req, res) => {
    res.json({ user: req.user });
};
