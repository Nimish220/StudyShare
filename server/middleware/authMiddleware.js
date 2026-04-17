const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Import your database config

const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: "Access Denied: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // --- FIX: Fetch the LATEST role from the Database ---
        const [rows] = await db.query("SELECT id, username, role FROM users WHERE id = ?", [decoded.id]);
        
        if (rows.length === 0) {
            return res.status(401).json({ message: "User no longer exists" });
        }

        // Attach the fresh database record to req.user
        req.user = rows[0]; 
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or Expired Token" });
    }
};

// 2. FOR PUBLIC BROWSING (Explore/Browse)
// This will NEVER send an error. It just identifies the user for bookmarks.
const optionalAuth = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [rows] = await db.query("SELECT id, username, role FROM users WHERE id = ?", [decoded.id]);
        req.user = rows.length > 0 ? rows[0] : null;
        next();
    } catch (err) {
        req.user = null; // Token expired? No problem, browse as guest.
        next();
    }
};

// Admin checks (Stay the same)
const isAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
        next();
    } else {
        return res.status(403).json({ message: "Access Denied: Admins only" });
    }
};

module.exports = { verifyToken, optionalAuth, isAdmin };

const isSuperAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'superadmin') {
        next();
    } else {
        return res.status(403).json({ message: "Access Denied: Super Admin clearance required" });
    }
};

module.exports = { verifyToken,optionalAuth, isAdmin, isSuperAdmin };