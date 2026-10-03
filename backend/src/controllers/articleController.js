const articleService = require('../services/articleService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getAll = catchAsync(async (req, res) => {
    const { search, category, sort, page = 1, limit = 10 } = req.query;
    const { articles, total } = await articleService.getAllArticles({
        search,
        category,
        sort,
        page,
        limit
    });

    const parsedLimit = parseInt(limit, 10) || 10;
    const parsedPage = parseInt(page, 10) || 1;
    const totalPages = Math.ceil(total / parsedLimit) || 1;

    res.status(200).json({
        success: true,
        count: articles.length,
        total,
        totalPages,
        currentPage: parsedPage,
        data: articles
    });
});

const getOne = catchAsync(async (req, res) => {
    // If the caller is admin editing the article, they might pass ?skip_view=true
    const shouldIncrementView = req.query.skip_view !== 'true';
    const article = await articleService.getArticleById(req.params.id, shouldIncrementView);
    res.status(200).json({ success: true, data: article });
});

const getCategories = catchAsync(async (req, res) => {
    const categories = await articleService.getCategories();
    res.status(200).json({ success: true, data: categories });
});

const getRelated = catchAsync(async (req, res) => {
    const related = await articleService.getRelatedArticles(req.params.id);
    res.status(200).json({ success: true, data: related });
});

const create = catchAsync(async (req, res) => {
    if (!req.body.title || !req.body.content) {
        throw new AppError('Title and Content are required', 400);
    }

    const newArticle = await articleService.createArticle(req.body, req.user.id);
    res.status(201).json({ success: true, data: newArticle });
});

const update = catchAsync(async (req, res) => {
    const updatedArticle = await articleService.updateArticle(req.params.id, req.body);
    res.status(200).json({ success: true, data: updatedArticle });
});

const remove = catchAsync(async (req, res) => {
    await articleService.deleteArticle(req.params.id);
    res.status(204).json({ success: true, data: null });
});

module.exports = {
    getAll,
    getOne,
    getCategories,
    getRelated,
    create,
    update,
    remove
};
