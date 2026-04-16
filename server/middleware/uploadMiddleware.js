const multer = require('multer');
const path = require('path');

// 1. Define where and how to store the files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        // Renames file to: 1712258...-notes.pdf (Prevents overwriting same-named files)
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// 2. Filter file types (Requirement: PDF, DOCX, Images)
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|pdf|docx/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (extName) {
        return cb(null, true);
    } else {
        cb(new Error("Error: Only Images, PDFs, and DOCX are allowed!"));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: fileFilter
});

module.exports = upload;