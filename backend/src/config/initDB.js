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
                category VARCHAR(100) DEFAULT 'General',
                views INTEGER DEFAULT 0,
                author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        // Migration check for existing databases
        await pool.query(`
            ALTER TABLE articles ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'General';
            ALTER TABLE articles ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
            ALTER TABLE articles ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
            CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
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

        // Migration check for articles event link and project demo url
        await pool.query(`
            ALTER TABLE articles ADD COLUMN IF NOT EXISTS event_id INTEGER REFERENCES events(id) ON DELETE SET NULL;
            ALTER TABLE articles ADD COLUMN IF NOT EXISTS project_url VARCHAR(255);
        `);

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
                phone VARCHAR(50),
                major VARCHAR(255) NOT NULL,
                motivation TEXT,
                niveau VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            ALTER TABLE club_applications ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
            ALTER TABLE club_applications ADD COLUMN IF NOT EXISTS niveau VARCHAR(50);
            ALTER TABLE club_applications ALTER COLUMN motivation DROP NOT NULL;
        `);
        console.log('✓ Club Applications table ready');

        // 9. Create Page Views & Analytics Table
        await pool.query(`
            ALTER TABLE events ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

            CREATE TABLE IF NOT EXISTS page_views (
                id SERIAL PRIMARY KEY,
                path VARCHAR(255) NOT NULL,
                event_type VARCHAR(50) DEFAULT 'pageview',
                resource_id INTEGER,
                resource_title VARCHAR(255),
                visitor_hash VARCHAR(64),
                referrer VARCHAR(500),
                device_type VARCHAR(20) DEFAULT 'desktop',
                browser VARCHAR(50) DEFAULT 'Other',
                os VARCHAR(50) DEFAULT 'Other',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
            CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
            CREATE INDEX IF NOT EXISTS idx_page_views_event_type ON page_views(event_type);
            CREATE INDEX IF NOT EXISTS idx_page_views_visitor_hash ON page_views(visitor_hash);
            CREATE INDEX IF NOT EXISTS idx_page_views_resource ON page_views(resource_id, event_type);
        `);
        console.log('✓ Page Views & Analytics table ready');
        console.log('--- DB INITIALIZATION COMPLETE ---');

    } catch (err) {
        console.error('CRITICAL: DB Initialization failed:', err);
    }
};

module.exports = initDB;
