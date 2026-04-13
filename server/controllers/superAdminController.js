const db = require('../config/db');
const bcrypt = require('bcryptjs');
// Helper to log actions - Call this in other controllers too!
const logAction = async (text, adminId = null) => {
    try {
        await db.query("INSERT INTO system_logs (action_text, admin_id) VALUES (?, ?)", [text, adminId]);
    } catch (err) {
        console.error("Logging failed:", err.message);
    }
};
exports.getSuperStats = async (req, res) => {
    try {
        const [userCount] = await db.query("SELECT COUNT(*) as total FROM users");
        const [adminCount] = await db.query("SELECT COUNT(*) as total FROM users WHERE role = 'admin'");
        const [superCount] = await db.query("SELECT COUNT(*) as total FROM users WHERE role = 'superadmin'");
        const [reportCount] = await db.query("SELECT COUNT(*) as total FROM materials WHERE report_count > 0");
        const [materialCount] = await db.query("SELECT COUNT(*) as total FROM materials");
        const [downloadCount] = await db.query("SELECT SUM(download_count) as total FROM materials");
        
        // Fetch the 6 most recent real events
        const [logs] = await db.query(`
            SELECT action_text as log_text, created_at as time_stamp 
            FROM system_logs 
            ORDER BY created_at DESC LIMIT 50
        `);

        res.json({
            totalUsers: userCount[0].total || 0,
            activeAdmins: adminCount[0].total || 0,
            totalSuperAdmins: superCount[0].total || 0,
            flaggedCount: reportCount[0].total || 0,
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
    const adminId = req.user.id; // From verifyToken middleware

    try {
        // 1. Prevent self-demotion (Safety Check)
        if (parseInt(id) === adminId) {
            return res.status(400).json({ message: "You cannot change your own role. Ask another Super Admin." });
        }

        // 2. Check if the target is a Super Admin
        const [[targetUser]] = await db.query("SELECT role FROM users WHERE id = ?", [id]);
        
        // 3. If demoting a Super Admin, ensure they aren't the last one
        if (targetUser.role === 'superadmin' && role !== 'superadmin') {
            const [[{ count }]] = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'superadmin'");
            if (count <= 1) {
                return res.status(400).json({ message: "System Protection: Cannot demote the last Super Admin." });
            }
        }

        await db.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
        await logAction(`Role for User ID ${id} updated to ${role}`, adminId);
        
        res.json({ message: "Role updated successfully" });
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

// --- NEW: Create User ---
exports.createUser = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        // 1. Check if user exists
        const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
        if (existing.length > 0) return res.status(400).json({ message: "Email already registered" });

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Insert into DB
        const [result] = await db.query(
            "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
            [username, email, hashedPassword, role || 'student']
        );

        await logAction(`Created new ${role}: ${username}`, req.user.id);
        
        res.status(201).json({ message: "User created successfully", userId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- NEW: Delete User (WITH LAST-ADMIN SAFETY) ---
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    const adminId = req.user.id; // The person performing the deletion

    try {
        // 1. Prevent deleting yourself
        if (parseInt(id) === adminId) {
            return res.status(400).json({ message: "Cannot delete your own account" });
        }

        // 2. Fetch target user's details before deleting
        const [userRows] = await db.query("SELECT username, role FROM users WHERE id = ?", [id]);
        if (userRows.length === 0) return res.status(404).json({ message: "User not found" });
        
        const targetUser = userRows[0];

        // 3. CRITICAL SAFETY: If deleting a Super Admin, check if they are the last one
        if (targetUser.role === 'superadmin') {
            const [[{ count }]] = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'superadmin'");
            if (count <= 1) {
                return res.status(400).json({ 
                    message: "System Protection: Cannot delete the last Super Admin. Promote another user first." 
                });
            }
        }

        // 4. Perform Deletion
        await db.query("DELETE FROM users WHERE id = ?", [id]);
        await logAction(`Deleted User: ${targetUser.username} (ID: ${id})`, adminId);

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
module.exports = { 
    ...exports, 
    getSuperStats: exports.getSuperStats,
    getAllUsersDetailed: exports.getAllUsersDetailed,
    updateUserRole: exports.updateUserRole,
    runMaintenance: exports.runMaintenance,
    createUser: exports.createUser,
    deleteUser: exports.deleteUser,
    logAction 
};