const cloudinary = require('cloudinary').v2;
// V4 requires destructuring the CloudinaryStorage class
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 1. Define Storage Engine for V4
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const ext = path.extname(file.originalname); 
    const publicId = Date.now() + '-' + file.originalname.split('.')[0];
    return {
      folder: 'studyshare_materials',
      resource_type: 'auto', // Correctly handles PDF, DOCX, and Images
      public_id: publicId, 
      format: ext.replace('.', '')
    };
  },
});

// 2. Filter file types (Remains mostly the same, but good to keep)
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|pdf|docx|doc|pptx/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    
    if (extName || mimeType) {
        cb(null, true);
    } else {
        cb(new Error("Error: Only Images, PDFs, Word and PPTX are allowed!"));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: fileFilter
});

module.exports = upload;