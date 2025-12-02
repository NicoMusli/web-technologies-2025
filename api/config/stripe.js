const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_fake_key');

module.exports = stripe;
