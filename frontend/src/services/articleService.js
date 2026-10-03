import api from './api';

const articleService = {
    getAll: async (params = {}) => {
        return await api.get('/articles', { params });
    },

    getById: async (id, skipView = false) => {
        const query = skipView ? '?skip_view=true' : '';
        return await api.get(`/articles/${id}${query}`);
    },

    getCategories: async () => {
        return await api.get('/articles/categories');
    },

    getRelated: async (id) => {
        return await api.get(`/articles/${id}/related`);
    },

    // Admin only
    create: async (data) => {
        return await api.post('/articles', data);
    },

    update: async (id, data) => {
        return await api.put(`/articles/${id}`, data);
    },

    delete: async (id) => {
        return await api.delete(`/articles/${id}`);
    }
};

export default articleService;
