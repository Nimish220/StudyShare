const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superAdminController');
const { verifyToken, isSuperAdmin } = require('../middleware/authMiddleware');

router.get('/stats', verifyToken, isSuperAdmin, superAdminController.getSuperStats);
router.get('/users', verifyToken, isSuperAdmin, superAdminController.getAllUsersDetailed);
router.patch('/role/:id', verifyToken, isSuperAdmin, superAdminController.updateUserRole);
router.post('/maintenance', verifyToken, isSuperAdmin, superAdminController.runMaintenance);

module.exports = router;