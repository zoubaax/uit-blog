require('dotenv').config();
const app = require('./src/app');
const pool = require('./src/config/db');
const initDB = require('./src/config/initDB');

const PORT = process.env.PORT || 5000;

// Connect to DB and start server
const startServer = async () => {
    try {
        // Ensure required tables exist
        await initDB();

        const server = app.listen(PORT);
        server.on('listening', () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
        });
        server.on('error', (error) => {
            console.error('Failed to start server:', error);
            process.exit(1);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
