const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Get token from header: "Bearer <token>"
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: "Access Denied: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adds user 'id' and 'role' to the request object
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or Expired Token" });
    }
};

module.exports = verifyToken;