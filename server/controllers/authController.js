const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Registration Logic
exports.register = async (req, res) => {
    // 1. Added 'role' to destructuring
    const { username, email, password, role } = req.body;

    try {
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 2. Insert 'role' into MySQL. If role is not provided, it defaults to 'student'
        await db.query(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role || 'student']
        );

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find user by email 
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = users[0];

        // 2. Compare encrypted password 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 3. Generate JWT Token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: "Login successful!",
            token,
            user: { id: user.id, username: user.username, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (user.length === 0) return res.status(404).json({ error: "User not found" });

        const token = Math.random().toString(36).substring(2, 15);
        const expiry = Date.now() + 900000; // 15 minutes in milliseconds

        await db.query(
            "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
            [token, expiry, email]
        );

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        await transporter.sendMail({
           from: '"StudyShare Support" <ronak.kwmcs@gmail.com>',
            to: email,
            subject: "Password Reset Request",
            html: `
                <div style="font-family: sans-serif; color: #2C1B18; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #5D4037;">StudyShare</h2>
                    <p>We received a request to reset your password. Click the button below to proceed:</p>
                    <a href="${resetLink}" style="display: inline-block; padding: 12px 25px; background-color: #5D4037; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                    <p style="font-size: 12px; color: #888; margin-top: 20px;">This link is valid for 15 minutes. If you didn't request this, you can ignore this email.</p>
                </div>
            `
        });

        res.json({ message: "Reset link sent to Gmail!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. RESET PASSWORD
exports.resetPassword = async (req, res) => {
    const { token, password } = req.body;
    try {
        const [user] = await db.query(
            "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?", 
            [token, Date.now()]
        );

        if (user.length === 0) {
            console.log("DB Search failed for email:", email);
            return res.status(400).json({ error: "Invalid or expired link" }); }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ?",
            [hashedPassword, token]
        );

        res.json({ message: "Password updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};