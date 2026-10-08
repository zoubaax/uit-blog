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

// Public: Get current announcement & history
router.get('/announcement', cacheMiddleware(30, '/api/v1/settings'), async (req, res, next) => {
    try {
        const announcement = await settingsModel.getSetting('announcement');
        const history = await settingsModel.getSetting('announcement_history') || [];
        res.json({ 
            success: true, 
            data: announcement || {
                is_active: false,
                type: 'custom',
                target_id: null,
                title: '',
                poster_url: '',
                link_url: '',
                button_text: 'Learn More'
            },
            history: Array.isArray(history) ? history : []
        });
    } catch (error) {
        next(error);
    }
});

// Admin: Update announcement configuration & auto-archive to history
router.put('/announcement', protect, async (req, res, next) => {
    try {
        invalidatePrefix('/api/v1/settings');
        const announcement = req.body;
        const updated = await settingsModel.updateSetting('announcement', announcement);

        let history = await settingsModel.getSetting('announcement_history') || [];
        if (!Array.isArray(history)) history = [];

        // Archive into history if there's a poster_url
        if (announcement.poster_url) {
            const existingIndex = history.findIndex(h => h.poster_url === announcement.poster_url);
            const historyEntry = {
                id: (existingIndex >= 0 ? history[existingIndex].id : Date.now().toString()),
                title: announcement.title || 'Announcement',
                poster_url: announcement.poster_url,
                link_url: announcement.link_url || '',
                button_text: announcement.button_text || 'View Details',
                type: announcement.type || 'custom',
                target_id: announcement.target_id || null,
                is_active: announcement.is_active,
                updated_at: new Date().toISOString()
            };

            if (existingIndex >= 0) {
                history[existingIndex] = {
                    ...history[existingIndex],
                    ...historyEntry
                };
            } else {
                history.unshift({
                    ...historyEntry,
                    created_at: new Date().toISOString()
                });
            }

            // Sync is_active in history so only current is active
            history = history.map(item => ({
                ...item,
                is_active: item.poster_url === announcement.poster_url && announcement.is_active
            }));

            // Keep up to 25 items in history
            history = history.slice(0, 25);
            await settingsModel.updateSetting('announcement_history', history);
        }

        res.json({ success: true, data: updated, history });
    } catch (error) {
        next(error);
    }
});

// Admin: Delete item from announcement history
router.delete('/announcement/history/:id', protect, async (req, res, next) => {
    try {
        invalidatePrefix('/api/v1/settings');
        let history = await settingsModel.getSetting('announcement_history') || [];
        if (Array.isArray(history)) {
            history = history.filter(h => String(h.id) !== String(req.params.id));
            await settingsModel.updateSetting('announcement_history', history);
        }
        res.json({ success: true, history });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
