const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // You created this in the previous step
const { verifyToken } = require('../middleware/authMiddleware');

// Route to update user profile (Username, Email, and Password)
// Path: /api/users/update-profile
router.put('/update-profile', verifyToken, userController.updateProfile);

module.exports = router;