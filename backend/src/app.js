const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// 1. CORS - MUST BE FIRST to handle errors in other middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
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

// Routes
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/articles', require('./routes/article.routes'));
app.use('/api/v1/events', require('./routes/event.routes'));
app.use('/api/v1/team', require('./routes/team.routes'));
app.use('/api/v1/registrations', require('./routes/registration.routes'));
app.use('/api/v1/settings', require('./routes/settings.routes'));

app.use((req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
});

app.use(errorHandler);

module.exports = app;
