const db = require('./config/db');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

const seedData = async () => {
    try {
        console.log("--- Starting Advanced Seeding (Match StudyShare DB) ---");
        
        // Use a simple hashed password for all dummy users
        const hashedPassword = await bcrypt.hash('password123', 10);
        const categories = ['DSA', 'DBMS', 'OS', 'CN', 'Web Development', 'AI/ML'];
        const dummyPdf = 'uploads/sample_dummy.pdf';

        // 1. Seed 1000 Users
        console.log("Seeding 1000 Users...");
        for (let i = 0; i < 1000; i++) {
            const username = faker.internet.username();
            const email = faker.internet.email();
            const createdDate = faker.date.recent({ days: 90 });

            // Using your column names: username, email, password, role, created_at
            await db.query(
                "INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, ?)",
                [username, email, hashedPassword, 'student', createdDate]
            );
            if (i % 250 === 0) console.log(`> ${i} users added...`);
        }

        // 2. Seed 100 Materials
        console.log("Seeding 100 Materials...");
        for (let i = 0; i < 100; i++) {
            const title = faker.company.catchPhrase();
            const desc = faker.lorem.paragraph();
            const cat = categories[Math.floor(Math.random() * categories.length)];
            const downloads = faker.number.int({ min: 10, max: 800 });
            const uploadDate = faker.date.recent({ days: 60 });

            // Using your column names: title, description, file_url, category, uploader_id, status, download_count, uploaded_at
            await db.query(
                "INSERT INTO materials (title, description, file_url, category, uploader_id, status, download_count, uploaded_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [title, desc, dummyPdf, cat, 1, 'approved', downloads, uploadDate]
            );
        }

        // 3. Seed some System Logs for the Timeline
        console.log("Seeding System Activity Logs...");
        for (let i = 0; i < 15; i++) {
            const logDate = faker.date.recent({ days: 5 });
            const actions = [
                "New user registered", 
                "System maintenance completed", 
                "Approved pending material ID: " + faker.number.int({min: 1, max: 100}),
                "Updated server security protocols"
            ];
            const action = actions[Math.floor(Math.random() * actions.length)];

            await db.query(
                "INSERT INTO system_logs (action_text, admin_id, created_at) VALUES (?, ?, ?)",
                [action, 3, logDate]
            );
        }

        console.log("--- Seeding Complete! 1000 Users & 100 Materials Added ---");
        process.exit();
    } catch (err) {
        console.error("Seeding Error:", err.message);
        process.exit(1);
    }
};

seedData();