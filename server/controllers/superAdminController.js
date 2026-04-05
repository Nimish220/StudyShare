const db = require('../config/db');

// Helper to log actions to the database
const logAction = async (text, adminId = null) => {
    try {
        await db.query("INSERT INTO system_logs (action_text, admin_id) VALUES (?, ?)", [text, adminId]);
    } catch (err) {
        console.error("Logging failed:", err.message);
    }
};

exports.getSuperStats = async (req, res) => {
    try {
        // 1. Fetch Totals
        const [userCount] = await db.query("SELECT COUNT(*) as total FROM users");
        const [adminCount] = await db.query("SELECT COUNT(*) as total FROM users WHERE role = 'admin'");
        const [materialCount] = await db.query("SELECT COUNT(*) as total FROM materials");
        const [downloadCount] = await db.query("SELECT SUM(download_count) as total FROM materials");
        
        // 2. Fetch Recent Activity from the logs table
        const [logs] = await db.query(`
            SELECT action_text as log_text, created_at as time_stamp 
            FROM system_logs 
            ORDER BY created_at DESC 
            LIMIT 6
        `);

        // 3. Single Response
        res.json({
            totalUsers: userCount[0].total || 0,
            activeAdmins: adminCount[0].total || 0,
            totalMaterials: materialCount[0].total || 0,
            totalDownloads: downloadCount[0].total || 0,
            recentActivity: logs.map(l => ({
                log_text: l.log_text,
                time_ago: new Date(l.time_stamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }))
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllUsersDetailed = async (req, res) => {
    try {
        const [users] = await db.query("SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC");
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body; 
    try {
        await db.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
        await logAction(`Role for User ID ${id} updated to ${role}`, req.user.id);
        res.json({ message: "Role updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.runMaintenance = async (req, res) => {
    try {
        await logAction(`System Maintenance performed`, req.user.id);
        res.json({ message: "Maintenance successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};