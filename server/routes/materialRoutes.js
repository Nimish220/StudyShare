const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const reviewController = require('../controllers/reviewController');
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { optionalAuth } = require('../middleware/authMiddleware');
const multer = require('multer');

router.get('/explore',optionalAuth,  materialController.getApprovedMaterials);

router.patch('/download/:id', materialController.trackDownload);
// User sees their own history 
router.get('/my-uploads', verifyToken, materialController.getMyMaterials);

// Public route to see reviews
router.get('/:id/reviews', reviewController.getMaterialReviews);

// Protected route to post a review
router.post('/rate', verifyToken, reviewController.addReview);

router.post('/bookmark', verifyToken, materialController.toggleBookmark); 
router.get('/bookmarks', verifyToken, materialController.getUserBookmarks);
router.post('/report', verifyToken, materialController.reportMaterial);

router.post('/upload', verifyToken, (req, res, next) => {
    // 1. Manually call the upload middleware
    upload.single('materialFile')(req, res, (err) => {
        // 2. Check if the error is a Multer limit error (like the 15MB limit)
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ error: "File too large! Max limit is 15MB." });
            }
            return res.status(400).json({ error: err.message });
        } 
        // 3. Check if it's the "Only Images, PDFs..." error from our fileFilter
        else if (err) {
            return res.status(400).json({ error: err.message });
        }
        
        // 4. If no error, proceed to the Controller
        next();
    });
}, materialController.uploadMaterial);
module.exports = router;