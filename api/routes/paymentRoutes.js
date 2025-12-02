const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/create-payment-intent', protect, paymentController.createPaymentIntent);
router.post('/confirm-payment', protect, paymentController.confirmPayment);
router.get('/', protect, paymentController.getAllPayments);

module.exports = router;
