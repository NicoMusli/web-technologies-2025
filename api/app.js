const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const cartRoutes = require('./routes/cartRoutes');
const statsRoutes = require('./routes/statsRoutes');
const orderChangeRoutes = require('./routes/orderChangeRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 1000
});
app.use('/api', limiter);

app.use(hpp());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use((req, res, next) => {
    next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/order-change-requests', orderChangeRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/favorites', require('./routes/favoritesRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

app.use(express.static(path.join(__dirname, '../build')));

app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

module.exports = app;
