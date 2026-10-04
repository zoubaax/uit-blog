const express = require('express');
const router = express.Router();
const settingsModel = require('../models/settingsModel');
const { protect } = require('../middlewares/authMiddleware');
const AppError = require('../utils/appError');
const { cacheMiddleware, invalidatePrefix } = require('../utils/cache');

// Public: Get join form status (cached for 30s)
router.get('/join-status', cacheMiddleware(30, '/api/v1/settings'), async (req, res, next) => {
    try {
        const enabled = await settingsModel.getSetting('join_form_enabled');
        res.json({ success: true, enabled: enabled === true || enabled === 'true' });
    } catch (error) {
        next(error);
    }
});

// Public: Submit application
router.post('/apply', async (req, res, next) => {
    try {
        const enabled = await settingsModel.getSetting('join_form_enabled');
        if (enabled !== true && enabled !== 'true') {
            throw new AppError('The join form is currently closed.', 400);
        }
        const { full_name, email, major, niveau } = req.body;
        if (!full_name || !email || !major || !niveau) {
            throw new AppError('Full name, email, filière, and niveau are required.', 400);
        }
        const app = await settingsModel.createApplication(req.body);
        res.status(201).json({ success: true, data: app });
    } catch (error) {
        next(error);
    }
});

// Admin: Toggle join form
router.put('/join-toggle', protect, async (req, res, next) => {
    try {
        invalidatePrefix('/api/v1/settings');
        const { enabled } = req.body;
        const value = await settingsModel.updateSetting('join_form_enabled', enabled);
        res.json({ success: true, enabled: value });
    } catch (error) {
        next(error);
    }
});

// Admin: Get all applications
router.get('/applications', protect, async (req, res, next) => {
    try {
        const apps = await settingsModel.getAllApplications();
        res.json({ success: true, data: apps });
    } catch (error) {
        next(error);
    }
});

// Admin: Delete one application
router.delete('/applications/:id', protect, async (req, res, next) => {
    try {
        await settingsModel.deleteApplication(req.params.id);
        res.json({ success: true, message: 'Application deleted' });
    } catch (error) {
        next(error);
    }
});

// Admin: Clear all applications
router.delete('/applications', protect, async (req, res, next) => {
    try {
        await settingsModel.clearAllApplications();
        res.json({ success: true, message: 'All applications cleared' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
