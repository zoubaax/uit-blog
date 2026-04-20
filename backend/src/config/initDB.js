const pool = require('./db');

const initDB = async () => {
    try {
        console.log('--- INITIALIZING SETTINGS & APPLICATIONS TABLES ---');

        // 1. Create Users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✓ Users table ready');

        // 2. Create Articles table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS articles (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                image_url VARCHAR(255),
                author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✓ Articles table ready');

        // 3. Create Events table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                date TIMESTAMP NOT NULL,
                location VARCHAR(255) NOT NULL,
                cover_image_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✓ Events table ready');

        // 4. Create Team Members table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS team_members (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                role VARCHAR(50) NOT NULL,
                photo_url VARCHAR(255),
                social_links JSONB DEFAULT '{}',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✓ Team Members table ready');

        // 5. Create Event Registrations table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS event_registrations (
                id SERIAL PRIMARY KEY,
                event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
                full_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                school_name VARCHAR(255),
                agreed_to_policies BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✓ Event Registrations table ready');

        // 6. Create Settings table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS settings (
                key VARCHAR(50) PRIMARY KEY,
                value JSONB
            );
        `);
        console.log('✓ Settings table ready');

        // 7. Insert default setting
        await pool.query(`
            INSERT INTO settings (key, value) VALUES ($1, $2) 
            ON CONFLICT (key) DO NOTHING;
        `, ['join_form_enabled', JSON.stringify(true)]);
        console.log('✓ Default settings seeded');

        // 8. Create Applications table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS club_applications (
                id SERIAL PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                major VARCHAR(255) NOT NULL,
                motivation TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✓ Club Applications table ready');
        console.log('--- DB INITIALIZATION COMPLETE ---');

    } catch (err) {
        console.error('CRITICAL: DB Initialization failed:', err);
    }
};

module.exports = initDB;
