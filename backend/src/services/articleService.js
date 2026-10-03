const articleModel = require('../models/articleModel');
const AppError = require('../utils/appError');

const getAllArticles = async (query = {}) => {
    return await articleModel.findAll(query);
};

const getArticleById = async (id, shouldIncrementView = true) => {
    const article = await articleModel.findById(id);
    if (!article) {
        throw new AppError('Article not found', 404);
    }
    if (shouldIncrementView) {
        await articleModel.incrementViews(id);
        article.views = (article.views || 0) + 1;
    }
    return article;
};

const getCategories = async () => {
    return await articleModel.getCategories();
};

const getRelatedArticles = async (id) => {
    const article = await articleModel.findById(id);
    if (!article) {
        throw new AppError('Article not found', 404);
    }
    return await articleModel.getRelated(id, article.category, 3);
};

const createArticle = async (data, authorId) => {
    const { title, content, image_url, category } = data;
    if (!title || !content) {
        throw new AppError('Title and content are required', 400);
    }
    return await articleModel.create(title, content, image_url || null, authorId, category || 'General');
};

const updateArticle = async (id, data) => {
    const existing = await articleModel.findById(id);
    if (!existing) {
        throw new AppError('Article not found', 404);
    }

    const title = data.title !== undefined ? data.title : existing.title;
    const content = data.content !== undefined ? data.content : existing.content;
    const image_url = data.image_url !== undefined ? data.image_url : existing.image_url;
    const category = data.category !== undefined ? data.category : existing.category;

    return await articleModel.update(id, title, content, image_url, category);
};

const deleteArticle = async (id) => {
    const existing = await articleModel.findById(id);
    if (!existing) {
        throw new AppError('Article not found', 404);
    }
    return await articleModel.remove(id);
};

module.exports = {
    getAllArticles,
    getArticleById,
    getCategories,
    getRelatedArticles,
    createArticle,
    updateArticle,
    deleteArticle
};
