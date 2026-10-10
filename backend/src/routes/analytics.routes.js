const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Public tracking endpoint
router.post('/track', analyticsController.track);

// Protected Admin stats endpoint
router.get('/stats', protect, restrictTo('admin'), analyticsController.getStats);

module.exports = router;
