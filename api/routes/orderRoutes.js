const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, upload.array('files', 10), orderController.createOrder);
router.get('/', protect, orderController.getAllOrders);
router.get('/user/:userId', protect, orderController.getUserOrders);
router.get('/:id', protect, orderController.getOrderById);
router.put('/:id', protect, orderController.updateOrderStatus);

module.exports = router;
