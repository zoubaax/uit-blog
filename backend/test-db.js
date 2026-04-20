require('dotenv').config();
const pool = require('./src/config/db').pool;

async function checkDB() {
    try {
        console.log('Testing DB connection...');
        const res = await pool.query('SELECT NOW()');
        console.log('Connection successful:', res.rows[0]);

        console.log('Checking tables...');
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log('Tables found:', tables.rows.map(r => r.table_name));

        if (tables.rows.some(r => r.table_name === 'articles')) {
            console.log('Checking articles count...');
            const count = await pool.query('SELECT COUNT(*) FROM articles');
            console.log('Articles count:', count.rows[0].count);
        } else {
            console.log('Articles table MISSING!');
        }

    } catch (err) {
        console.error('DB Check failed:', err);
    } finally {
        process.exit();
    }
}

checkDB();
