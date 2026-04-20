const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes.js');
require('dotenv').config();
console.log("AuthRoutes Loaded:", authRoutes.stack ? "YES" : "NO");
const app = express();

// Middleware
app.use(cors({
  origin: ["https://study-share-olive.vercel.app", "http://localhost:5173"],
  credentials: true
}));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
const materialRoutes = require('./routes/materialRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const multer = require('multer');
app.use('/api/materials', materialRoutes);
// Workflow: Login -> Verify Token -> Save File -> Save Metadata
app.use('/api/super', superAdminRoutes);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Multer Error: ${err.message}` });
  } else if (err) {
    return res.status(500).json({ error: err.message });
  }
  next();
});
// Test Route
app.get('/', (req, res) => {
    res.send("StudyShare Server is Running!");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});