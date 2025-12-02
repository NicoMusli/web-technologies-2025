const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { protect } = require('../middleware/auth');

router.get('/admin', protect, statsController.getAdminStats);
router.get('/client/:userId', protect, statsController.getClientStats);

module.exports = router;
