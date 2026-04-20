const cloudinary = require('cloudinary').v2;
// V4 requires destructuring the CloudinaryStorage class
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

console.log("Cloud:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("Key:", process.env.CLOUDINARY_API_KEY ? "OK" : "MISSING");
console.log("Secret:", process.env.CLOUDINARY_API_SECRET ? "OK" : "MISSING");
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
    const fileExt = path.extname(file.originalname).toLowerCase(); // .pptx
    const fileName = path.parse(file.originalname).name;
    return {
      folder: 'studyshare_materials',
      resource_type: 'raw',
      public_id: `${fileName}-${Date.now()}`,
      format: fileExt.replace('.', '')
    };
  },
});

// 2. Filter file types (Remains mostly the same, but good to keep)
const fileFilter = (req, file, cb) => {
    console.log("MIME TYPE DETECTED:", file.mimetype);
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