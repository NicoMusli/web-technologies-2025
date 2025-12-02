const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 5 }]), productController.createProduct);
router.put('/:id', protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 5 }]), productController.updateProduct);
router.delete('/:id', protect, productController.deleteProduct);

module.exports = router;
