const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// 1. CORS - MUST BE FIRST
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'https://uit-upf.tech',
    'https://www.uit-upf.tech',
    'https://uit-blog.vercel.app',
    process.env.FRONTEND_URL
].filter(Boolean);

const isOriginAllowed = (origin) => {
    if (!origin) return true; // Allow mobile apps, curl, or server-to-server requests
    if (allowedOrigins.includes(origin)) return true;
    
    // Allow any localhost or 127.0.0.1 port (e.g., 5173, 5174, 3000)
    if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return true;
    if (/^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) return true;
    
    // Allow local network IP addresses for mobile device testing (e.g., http://192.168.1.5:5173)
    if (/^http:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/.test(origin)) return true;

    if (/^https:\/\/(www\.)?uit-upf\.tech$/.test(origin)) return true;
    if (/^https:\/\/uit-blog.*\.vercel\.app$/.test(origin)) return true;
    return false;
};

app.use(cors({
    origin: (origin, callback) => {
        if (isOriginAllowed(origin)) {
            return callback(null, true);
        }
        console.warn(`[CORS Blocked] Origin not allowed: ${origin}`);
        return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// 2. Set Security HTTP headers
app.use(helmet());

// 3. Body parser - INREASED LIMIT
app.use(express.json({ limit: '1mb' }));

// 6. Prevent parameter pollution
app.use(hpp());

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Root route for deployment testing
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'UIT Club API is live!',
        version: '1.0.0',
        environment: process.env.NODE_ENV
    });
});

// Routes
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/articles', require('./routes/article.routes'));
app.use('/api/v1/events', require('./routes/event.routes'));
app.use('/api/v1/team', require('./routes/team.routes'));
app.use('/api/v1/registrations', require('./routes/registration.routes'));
app.use('/api/v1/settings', require('./routes/settings.routes'));
app.use('/api/v1/upload', require('./routes/upload.routes'));
app.use('/api/v1/analytics', require('./routes/analytics.routes'));

app.use((req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
});

app.use(errorHandler);

module.exports = app;
