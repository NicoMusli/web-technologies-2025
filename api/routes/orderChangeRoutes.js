const express = require('express');
const router = express.Router();
const orderChangeController = require('../controllers/orderChangeController');
const { protect } = require('../middleware/auth');

router.post('/', protect, orderChangeController.createChangeRequest);
router.get('/', protect, orderChangeController.getAllChangeRequests);
router.get('/order/:orderId', protect, orderChangeController.getChangeRequestsByOrder);
router.put('/:id', protect, orderChangeController.updateChangeRequest);

module.exports = router;
