const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

// Use connection string for cloud providers, fallback to individual params
const connectionConfig = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
} : {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};

const pool = new Pool(connectionConfig);

// Global header for handling pool errors (e.g. backend crashes)
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool, // Export pool for transaction scenarios
};
