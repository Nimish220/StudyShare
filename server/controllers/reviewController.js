const db = require('../config/db');

exports.addReview = async (req, res) => {
    const { material_id, rating, comment } = req.body;
    const user_id = req.user.id; // From your JWT middleware

    try {
        // Check if user already reviewed this material to prevent spam
        const [existing] = await db.query(
            'SELECT * FROM reviews WHERE material_id = ? AND user_id = ?',
            [material_id, user_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "You have already reviewed this material" });
        }

        await db.query(
            'INSERT INTO reviews (material_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
            [material_id, user_id, rating, comment]
        );

        res.status(201).json({ message: "Review added successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMaterialReviews = async (req, res) => {
    const { id } = req.params;

    try {
        const [reviews] = await db.query(
            `SELECT r.*, u.username 
             FROM reviews r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.material_id = ? 
             ORDER BY r.created_at DESC`,
            [id]
        );
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};