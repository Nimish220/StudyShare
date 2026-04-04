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


app.use('/api/auth', authRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send("StudyShare Server is Running!");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});