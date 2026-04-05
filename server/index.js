const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes.js');
require('dotenv').config();
console.log("AuthRoutes Loaded:", authRoutes.stack ? "YES" : "NO");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
const materialController = require('./controllers/materialController');
const { verifyToken } = require('./middleware/authMiddleware');
const upload = require('./middleware/uploadMiddleware');
const materialRoutes = require('./routes/materialRoutes');

app.use('/api/materials', materialRoutes);
// Workflow: Login -> Verify Token -> Save File -> Save Metadata
app.post(
    '/api/materials/upload', 
    verifyToken,                   // 1. Check if user is logged in
    upload.single('materialFile'),     // 2. Save file to /uploads
    materialController.uploadMaterial  // 3. Save details to MySQL
);

// Test Route
app.get('/', (req, res) => {
    res.send("StudyShare Server is Running!");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});