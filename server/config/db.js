const mysql = require('mysql2');
require('dotenv').config();

// Create a pool to handle multiple concurrent student requests
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 25060,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: false
    }
});

// Use promise-based wrapper for async/await support
const promisePool = pool.promise();

// Immediate connection test
pool.getConnection((err, connection) => {
    if (err) {
        console.error(' MySQL Connection Error:', err.message);
    } else {
        console.log(' StudyShare DB Connected Successfully');
        connection.release();
    }
});

module.exports = promisePool;