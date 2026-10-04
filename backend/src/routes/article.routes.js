const express = require('express');
const articleController = require('../controllers/articleController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const { cacheMiddleware, invalidatePrefix } = require('../utils/cache');

const router = express.Router();

// Public routes with fast caching
router.get('/', cacheMiddleware(60, '/api/v1/articles'), articleController.getAll);
router.get('/categories', cacheMiddleware(300, '/api/v1/articles'), articleController.getCategories);
router.get('/:id/related', cacheMiddleware(60, '/api/v1/articles'), articleController.getRelated);
router.get('/:id', cacheMiddleware(60, '/api/v1/articles'), articleController.getOne);

// Protected Admin routes
router.use(protect);
router.use(restrictTo('admin'));

// Middleware to invalidate cache on any admin mutation
router.use((req, res, next) => {
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        invalidatePrefix('/api/v1/articles');
    }
    next();
});

router.post('/', articleController.create);
router.put('/:id', articleController.update);
router.delete('/:id', articleController.remove);

module.exports = router;
