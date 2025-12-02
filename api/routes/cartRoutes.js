const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', protect, cartController.getCart);
router.post('/upload', protect, upload.array('files', 5), cartController.uploadCartFiles);
router.post('/items', protect, cartController.addItemToCart);
router.put('/items/:id', protect, cartController.updateCartItem);
router.delete('/items/:id', protect, cartController.removeCartItem);
router.delete('/', protect, cartController.clearCart);

module.exports = router;
