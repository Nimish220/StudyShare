const db = require('../config/db');
const { logAction } = require('./superAdminController'); // Import the helper
// Fetch only approved materials with Unique Ratings and Bookmark Status
exports.getApprovedMaterials = async (req, res) => {
    try {
        const { search, category } = req.query;
        const userId = req.user ? req.user.id : 0; // Get ID if user is logged in
        
        // Updated Query: Calculates AVG rating and checks if current user bookmarked it
        let query = `
            SELECT 
                m.*, 
                u.username AS author,
                IFNULL(AVG(r.rating), 0) AS avg_rating,
                COUNT(DISTINCT r.id) AS review_count,
                IF(COUNT(DISTINCT b.id) > 0, 1, 0) AS isBookmarked,
                (SELECT COUNT(*) FROM reviews WHERE material_id = m.id AND user_id = ?) as userHasRated
            FROM materials m 
            JOIN users u ON m.uploader_id = u.id 
            LEFT JOIN reviews r ON m.id = r.material_id
            LEFT JOIN bookmarks b ON m.id = b.material_id AND b.user_id = ?
            WHERE m.status = 'approved'
        `;
        
        let params = [userId, userId];

        // Filter logic remains stable to prevent UI jumping
        if (category && category !== 'All') {
            query += " AND m.category = ?";
            params.push(category);
        }

        if (search) {
            query += " AND (m.title LIKE ? OR m.description LIKE ?)";
            params.push(`%${search}%`, `%${search}%`);
        }

        // Grouping is REQUIRED for unique aggregate functions (AVG/COUNT)
        query += " GROUP BY m.id";

        const [materials] = await db.query(query, params);
        res.json(materials);
    } catch (err) {
        console.error("SQL Error:", err.message);
        res.status(500).json({ error: err.message });
    }
};



exports.uploadMaterial = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded or file type not supported." });
        }

        // With multer-storage-cloudinary, req.file.path should be the HTTPS URL
        // If it starts with /opt/render, it means it saved to disk instead of cloud
        const file_url = req.file.path; 
        
        console.log("DEBUG: File path received:", file_url); 

        const { title, description, category,tags } = req.body;
        const uploader_id = req.user.id; 

        const [userRows] = await db.query("SELECT username FROM users WHERE id = ?", [uploader_id]);
        const actualName = userRows[0]?.username || "A User";

        const sql = `INSERT INTO materials (title, description, file_url, category, uploader_id, tags) VALUES (?, ?, ?, ?, ?, ?)`;
        await db.query(sql, [title, description, file_url, category, uploader_id, tags || '']);

        await logAction(`${actualName} uploaded a new material: "${title}"`,uploader_id);

        res.status(201).json({ message: "Upload Successful" });
    } catch (err) {
        console.error("Upload Controller Error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.trackDownload = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = "UPDATE materials SET download_count = download_count + 1 WHERE id = ?";
        
        await db.query(sql, [id]);
        res.json({ message: "Download count updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMyMaterials = async (req, res) => {
    try {
        const uploader_id = req.user.id; 
        // Also get ratings for personal uploads to show performance [cite: 16]
        const query = `
            SELECT m.*, IFNULL(AVG(r.rating), 0) AS avg_rating 
            FROM materials m
            LEFT JOIN reviews r ON m.id = r.material_id
            WHERE m.uploader_id = ?
            GROUP BY m.id
        `;
        const [materials] = await db.query(query, [uploader_id]);
        res.json(materials);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// materialController.js

exports.toggleBookmark = async (req, res) => {
    try {
        const { material_id } = req.body;
        const user_id = req.user.id;

        // Check if already bookmarked
        const [existing] = await db.query(
            "SELECT * FROM bookmarks WHERE user_id = ? AND material_id = ?",
            [user_id, material_id]
        );

        if (existing.length > 0) {
            // Remove bookmark
            await db.query("DELETE FROM bookmarks WHERE user_id = ? AND material_id = ?", [user_id, material_id]);
            return res.json({ message: "Bookmark removed", isBookmarked: false });
        } else {
            // Add bookmark
            await db.query("INSERT INTO bookmarks (user_id, material_id) VALUES (?, ?)", [user_id, material_id]);
            return res.json({ message: "Bookmarked successfully", isBookmarked: true });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUserBookmarks = async (req, res) => {
    try {
        const user_id = req.user.id;
        const sql = `
            SELECT 
                m.*, 
                u.username AS author, 
                1 AS isBookmarked,
                IFNULL(AVG(r.rating), 0) AS avg_rating
            FROM materials m
            JOIN bookmarks b ON m.id = b.material_id
            JOIN users u ON m.uploader_id = u.id
            LEFT JOIN reviews r ON m.id = r.material_id
            WHERE b.user_id = ?
            GROUP BY m.id
        `;
        const [bookmarks] = await db.query(sql, [user_id]);
        res.json(bookmarks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.reportMaterial = async (req, res) => {
    try {
        const { material_id } = req.body;
        // Logic: Increment report_count
        await db.query("UPDATE materials SET report_count = report_count + 1 WHERE id = ?", [material_id]);
        res.json({ message: "Report submitted to Admin." });
    } catch (err) { res.status(500).json({ error: err.message }); }
};