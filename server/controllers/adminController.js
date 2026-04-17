const db = require('../config/db');
const superAdminController = require('./superAdminController');
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
        const adminId = req.user.id; // From verifyToken middleware

        // 1. Get Details: Material Title, Uploader Name, and Admin Name
        const [details] = await db.query(`
            SELECT m.title, u_student.username as student_name, u_admin.username as admin_name
            FROM materials m
            JOIN users u_student ON m.uploader_id = u_student.id
            JOIN users u_admin ON u_admin.id = ?
            WHERE m.id = ?
        `, [adminId, id]);

        if (details.length === 0) {
            return res.status(404).json({ error: "Material not found" });
        }

        const { title, student_name, admin_name } = details[0];

        // 2. Perform the approval update
        await db.query("UPDATE materials SET status = 'approved' WHERE id = ?", [id]);

        // 3. LOG THE ACTION with full details
        // Format: "Admin Ronak approved 'Operating Systems' uploaded by John Doe"
        await superAdminController.logAction(
            `Admin ${admin_name} approved "${title}" uploaded by ${student_name}`, 
            adminId
        );

        res.json({ message: "Material approved and action logged" });
    } catch (err) {
        console.error("Approve Error:", err);
        res.status(500).json({ error: err.message });
    }
};
exports.deleteMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id; // From verifyToken middleware

        // 1. Get Details: Material Title, Uploader Name, and Admin Name
        const [details] = await db.query(`
            SELECT m.title, u_student.username as student_name, u_admin.username as admin_name
            FROM materials m
            JOIN users u_student ON m.uploader_id = u_student.id
            JOIN users u_admin ON u_admin.id = ?
            WHERE m.id = ?
        `, [adminId, id]);

        if (details.length === 0) {
            return res.status(404).json({ error: "Material not found" });
        }

        const { title, student_name, admin_name } = details[0];

        // 2. Perform the deletion
        await db.query('DELETE FROM materials WHERE id = ?', [id]);

        // 3. LOG THE ACTION with full details
        // Format: "Admin Ronak removed 'Operating Systems' uploaded by John Doe"
        await superAdminController.logAction(
            `Admin ${admin_name} removed "${title}" uploaded by ${student_name}`, 
            adminId
        );

        res.json({ message: "Material removed and action logged" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ error: "Database error during deletion" });
    }
};
exports.getSystemLogs = async (req, res) => {
    try {
        const adminId = req.user.id;
        const role = req.user.role;

        let sql;
        let params = [];

        // If SuperAdmin, show all logs. If Admin, show only their own actions.
        if (role === 'superadmin') {
            sql = `SELECT * FROM system_logs ORDER BY created_at DESC LIMIT 100`;
        } else {
            sql = `SELECT * FROM system_logs WHERE admin_id = ? ORDER BY created_at DESC LIMIT 50`;
            params = [adminId];
        }

        const [logs] = await db.query(sql, params);
        res.json(logs);
    } catch (err) {
        console.error("Logs Fetch Error:", err);
        res.status(500).json({ error: "Failed to fetch logs" });
    }
};
// Get all materials with at least 1 report
exports.getReportedMaterials = async (req, res) => {
    try {
        const sql = `
            SELECT m.*, u.username as uploader_name 
            FROM materials m 
            JOIN users u ON m.uploader_id = u.id 
            WHERE m.report_count > 0 
            ORDER BY m.report_count DESC
        `;
        const [materials] = await db.query(sql);
        res.json(materials);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.handleReportAction = async (req, res) => {
    try {
        const { material_id, action } = req.body;
        const adminId = req.user.id;

        // Fetch material title for the log
        const [[material]] = await db.query("SELECT title FROM materials WHERE id = ?", [material_id]);

        if (action === 'dismiss') {
            await db.query("UPDATE materials SET report_count = 0 WHERE id = ?", [material_id]);
            await superAdminController.logAction(`Admin cleared reports for "${material.title}"`, adminId);
            return res.json({ message: "Reports cleared." });
        } else if (action === 'reject') {
            await db.query("UPDATE materials SET status = 'rejected', report_count = 0 WHERE id = ?", [material_id]);
            await superAdminController.logAction(`Admin REJECTED flagged material: "${material.title}"`, adminId);
            return res.json({ message: "Material removed." });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};