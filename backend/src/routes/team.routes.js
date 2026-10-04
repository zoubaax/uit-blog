const express = require('express');
const teamController = require('../controllers/teamController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const { cacheMiddleware, invalidatePrefix } = require('../utils/cache');

const router = express.Router();

// Public routes with fast caching
router.get('/', cacheMiddleware(120, '/api/v1/team'), teamController.getAll);
router.get('/:id', cacheMiddleware(120, '/api/v1/team'), teamController.getOne);

// Protected Admin routes
router.use(protect);
router.use(restrictTo('admin'));

// Invalidate on mutations
router.use((req, res, next) => {
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        invalidatePrefix('/api/v1/team');
    }
    next();
});

router.post('/', teamController.create);
router.put('/:id', teamController.update);
router.delete('/:id', teamController.remove);

module.exports = router;
