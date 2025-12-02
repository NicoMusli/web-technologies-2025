const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/', protect, userController.getAllUsers);
router.get('/:id', protect, userController.getUserById);
router.get('/check-username/:username', userController.checkUsername);
router.put('/:id', protect, userController.updateUser);
router.put('/:id/password', protect, userController.updatePassword);

module.exports = router;
