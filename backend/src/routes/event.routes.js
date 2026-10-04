const express = require('express');
const eventController = require('../controllers/eventController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const { cacheMiddleware, invalidatePrefix } = require('../utils/cache');

const router = express.Router();

// Public routes with fast caching
router.get('/', cacheMiddleware(60, '/api/v1/events'), eventController.getAll);
router.get('/:id', cacheMiddleware(60, '/api/v1/events'), eventController.getOne);

// Protected Admin routes
router.use(protect);
router.use(restrictTo('admin'));

// Invalidate on mutations
router.use((req, res, next) => {
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        invalidatePrefix('/api/v1/events');
    }
    next();
});

router.post('/', eventController.create);
router.put('/:id', eventController.update);
router.delete('/:id', eventController.remove);

module.exports = router;
