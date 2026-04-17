const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const reviewController = require('../controllers/reviewController');
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { optionalAuth } = require('../middleware/authMiddleware');
router.get('/explore',optionalAuth,  materialController.getApprovedMaterials);

// Increment Stat: Call this via axios when the download button is clicked 
router.patch('/download/:id', verifyToken, materialController.trackDownload);
// User sees their own history 
router.get('/my-uploads', verifyToken, materialController.getMyMaterials);

// Public route to see reviews
router.get('/:id/reviews', reviewController.getMaterialReviews);

// Protected route to post a review
router.post('/rate', verifyToken, reviewController.addReview);

router.post('/bookmark', verifyToken, materialController.toggleBookmark); 
router.get('/bookmarks', verifyToken, materialController.getUserBookmarks);
router.post('/report', verifyToken, materialController.reportMaterial);
router.post('/upload', verifyToken, upload.single('materialFile'), materialController.uploadMaterial);
module.exports = router;