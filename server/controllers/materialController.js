const db = require('../config/db');

// Fetch only approved materials with Unique Ratings and Bookmark Status
exports.getApprovedMaterials = async (req, res) => {
    try {
        const { search, category } = req.query;
        const userId = req.user ? req.user.id : null; // Get ID if user is logged in
        
        // Updated Query: Calculates AVG rating and checks if current user bookmarked it
        let query = `
            SELECT 
                m.*, 
                u.username AS author,
                IFNULL(AVG(r.rating), 0) AS avg_rating,
                COUNT(DISTINCT r.id) AS review_count,
                CASE WHEN b.id IS NOT NULL THEN true ELSE false END AS isBookmarked
            FROM materials m 
            JOIN users u ON m.uploader_id = u.id 
            LEFT JOIN reviews r ON m.id = r.material_id
            LEFT JOIN bookmarks b ON m.id = b.material_id AND b.user_id = ?
            WHERE m.status = 'approved'
        `;
        
        let params = [userId];

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
        res.status(500).json({ error: err.message });
    }
};

exports.uploadMaterial = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const uploader_id = req.user.id; 
        const file_url = req.file.path;  

        // Requirement: Default status is 'pending' for Admin Moderation [cite: 11, 18]
        const sql = `
            INSERT INTO materials (title, description, file_url, category, uploader_id) 
            VALUES (?, ?, ?, ?, ?)
        `;

        await db.query(sql, [title, description, file_url, category, uploader_id]);

        res.status(201).json({
            message: "Success! Material uploaded and saved to database.",
            details: { title, category, file_url }
        });
    } catch (err) {
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
            SELECT m.*, u.username as author, 1 as isBookmarked
            FROM materials m
            JOIN bookmarks b ON m.id = b.material_id
            JOIN users u ON m.uploader_id = u.id
            WHERE b.user_id = ?
        `;
        const [bookmarks] = await db.query(sql, [user_id]);
        res.json(bookmarks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};