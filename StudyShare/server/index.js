const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); 
const db = require('./db'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000; 

// 1. GLOBAL MIDDLEWARE 
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// 2. ENSURE UPLOADS FOLDER EXISTS 
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// 3. MULTER CONFIGURATION
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// 4. DATABASE CONNECTION TEST
async function testConnection() {
  try {
    const [rows] = await db.execute('SELECT 1 + 1 AS result');
    console.log(' MySQL Database Connected Successfully!');
  } catch (err) {
    console.error('❌ Database Connection Failed:', err.message);
  }
}
testConnection();

// 5. ROUTES
app.get('/', (req, res) => {
  res.send('StudyShare Server is running!');
});

// GET all materials
app.get('/api/materials', async (req, res) => {
  try {
    // 1. Get search and type from the URL (React sends these automatically)
    const { q, type } = req.query; 
    
    // 2. Start with a basic query
    let sql = "SELECT * FROM materials WHERE 1=1";
    const params = [];

    // 3. Add search filter (like your old search.php)
    if (q) {
      sql += " AND filename LIKE ?";
      params.push(`%${q}%`);
    }

    // 4. Add type filter
    if (type && type !== 'all') {
      if (type === 'image') {
        sql += " AND filetype IN ('jpg', 'png', 'webp', 'jpeg')";
      } else {
        sql += " AND filetype = ?";
        params.push(type);
      }
    }

    // 5. Order by date
    sql += " ORDER BY upload_date DESC";

    // 6. Execute and send back JSON
    const [rows] = await db.execute(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("Search API Error:", err);
    res.status(500).json({ error: "Failed to fetch materials" });
  }
});

// POST new material
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { originalname, filename, size } = req.file;
    const extension = path.extname(originalname).slice(1); 
    const filepath = `uploads/${filename}`;

    const [result] = await db.execute(
      "INSERT INTO materials (filename, filepath, filetype, filesize) VALUES (?, ?, ?, ?)",
      [originalname, filepath, extension, size]
    );

    res.json({ 
      success: true, 
      message: "File uploaded successfully!", 
      id: result.insertId 
    });
  } catch (err) {
    console.error("Upload DB Error:", err);
    res.status(500).json({ error: "Failed to save to database" });
  }
});

// 6. START SERVER
app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});