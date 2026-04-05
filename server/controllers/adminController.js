const db = require('../config/db');

exports.getAdminStats = async (req, res) => {
    try {
        const [materials] = await db.query("SELECT COUNT(*) as total FROM materials");
        const [users] = await db.query("SELECT COUNT(*) as total FROM users");
        const [downloads] = await db.query("SELECT SUM(download_count) as total FROM materials");
        const [pending] = await db.query("SELECT COUNT(*) as total FROM materials WHERE status = 'pending'");

        res.json({
            totalMaterials: materials[0].total,
            totalUsers: users[0].total,
            totalDownloads: downloads[0].total || 0,
            pendingReviews: pending[0].total
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPendingMaterials = async (req, res) => {
    try {
        const sql = `
            SELECT m.*, u.username as author 
            FROM materials m 
            JOIN users u ON m.uploader_id = u.id 
            WHERE m.status = 'pending'
        `;
        const [materials] = await db.query(sql);
        res.json(materials);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query("SELECT id, username, email, role, created_at FROM users");
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.approveMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("UPDATE materials SET status = 'approved' WHERE id = ?", [id]);
        res.json({ message: "Material approved successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        // Optional: you could also delete the actual file from the /uploads folder here
        await db.query('DELETE FROM materials WHERE id = ?', [id]);
        res.json({ message: "Material removed successfully" });
    } catch (err) {
        res.status(500).json({ error: "Database error during deletion" });
    }
};