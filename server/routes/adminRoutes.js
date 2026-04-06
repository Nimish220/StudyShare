const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// All routes here require Login AND Admin role
router.get('/stats', verifyToken, isAdmin, adminController.getAdminStats);
router.get('/pending', verifyToken, isAdmin, adminController.getPendingMaterials);
router.get('/users', verifyToken, isAdmin, adminController.getAllUsers);
router.get('/logs', verifyToken, isAdmin, adminController.getSystemLogs);
router.put('/approve/:id', verifyToken, isAdmin, adminController.approveMaterial);
router.delete('/material/:id', verifyToken, isAdmin, adminController.deleteMaterial);
module.exports = router;