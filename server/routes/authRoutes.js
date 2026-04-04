const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


// Route for Registration [Requirement: Implement user registration and login functionality]
router.post('/register', authController.register);
router.post('/login', authController.login);
module.exports = router;