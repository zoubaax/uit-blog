const express = require('express');
const articleController = require('../controllers/articleController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', articleController.getAll);
router.get('/categories', articleController.getCategories);
router.get('/:id/related', articleController.getRelated);
router.get('/:id', articleController.getOne);

// Protected Admin routes
// Apply protection to all routes below this line
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', articleController.create);
router.put('/:id', articleController.update);
router.delete('/:id', articleController.remove);

module.exports = router;
