const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

// Use connection string for cloud providers, fallback to individual params
const connectionConfig = process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 30000, // 30s for Neon cold-start
} : {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 30000,
};

const pool = new Pool(connectionConfig);

// Global handler for handling pool errors (e.g. backend crashes)
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    // Don't exit the process — just log the error and let the pool recover
});

// Retry wrapper for queries — handles Neon cold-start & transient DNS failures
const queryWithRetry = async (text, params, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await pool.query(text, params);
        } catch (error) {
            const isTransient = error.message.includes('ENOTFOUND') ||
                                error.message.includes('connection timeout') ||
                                error.message.includes('Connection terminated') ||
                                error.code === 'ECONNREFUSED';

            if (isTransient && attempt < retries) {
                console.warn(`DB query attempt ${attempt} failed (${error.message}). Retrying in ${attempt * 2}s...`);
                await new Promise(resolve => setTimeout(resolve, attempt * 2000));
            } else {
                throw error;
            }
        }
    }
};

module.exports = {
    query: queryWithRetry,
    pool, // Export pool for transaction scenarios
};
