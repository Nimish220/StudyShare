const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email, currentPassword, newPassword } = req.body;

        // 1. Fetch the user's current hashed password from MySQL
        const [users] = await db.query("SELECT password FROM users WHERE id = ?", [userId]);
        if (users.length === 0) return res.status(404).json({ error: "User not found" });

        // 2. Compare the provided 'currentPassword' with the DB hash
        const isMatch = await bcrypt.compare(currentPassword, users[0].password);
        if (!isMatch) {
            return res.status(401).json({ error: "Current password is incorrect." });
        }

        // 3. Start building the update query
        let sql = "UPDATE users SET username = ?, email = ?";
        let params = [username, email];

        // 4. If the user wants a new password, hash it and add to query
        if (newPassword && newPassword.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            sql += ", password = ?";
            params.push(hashedPassword);
        }

        sql += " WHERE id = ?";
        params.push(userId);

        // 5. Execute the update
        await db.query(sql, params);
        res.json({ message: "Profile updated successfully!" });

    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};