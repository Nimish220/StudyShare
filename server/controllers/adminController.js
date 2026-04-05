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

// Inside adminController.js
const { logAction } = require('./superAdminController');

exports.approveMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;

        // Fetches Admin name from DB
        const [adminRows] = await db.query("SELECT username FROM users WHERE id = ?", [adminId]);
        const adminName = adminRows[0]?.username || "An Admin";

        await db.query("UPDATE materials SET status = 'approved' WHERE id = ?", [id]);

        // Logs with the admin's actual name
        await logAction(`${adminName} approved material ID: ${id}`);

        res.json({ message: "Material approved" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.deleteMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;

        // 1. Get the admin's name (to show who did the deleting)
        const [adminRows] = await db.query("SELECT username FROM users WHERE id = ?", [adminId]);
        const adminName = adminRows[0]?.username || "An Admin";

        // 2. Optional: Get the material title before deleting it so the log is descriptive
        const [materialRows] = await db.query("SELECT title FROM materials WHERE id = ?", [id]);
        const materialTitle = materialRows[0]?.title || "Unknown Material";

        // 3. Perform the deletion
        await db.query('DELETE FROM materials WHERE id = ?', [id]);

        // 4. LOG THE ACTION - This makes it show up in Super Admin Recent Activity
        await logAction(`${adminName} removed flagged material: "${materialTitle}" (ID: ${id})`);

        res.json({ message: "Material removed successfully" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ error: "Database error during deletion" });
    }
};