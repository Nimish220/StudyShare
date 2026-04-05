const jwt = require('jsonwebtoken');

// 1. Define verifyToken
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: "Access Denied: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or Expired Token" });
    }
};

// 2. Define isAdmin (You were missing this export!)
const isAdmin = (req, res, next) => {
    // Check if user object exists and has admin/superadmin role
    if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
        next();
    } else {
        return res.status(403).json({ message: "Access Denied: Admins only" });
    }
};

// 3. Export them together as an object
module.exports = { verifyToken, isAdmin };