import api from './api';

const settingsService = {
    getJoinStatus: async () => {
        return await api.get('/settings/join-status');
    },

    submitApplication: async (data) => {
        return await api.post('/settings/apply', data);
    },

    // Admin only
    toggleJoinForm: async (enabled) => {
        return await api.put('/settings/join-toggle', { enabled });
    },

    getApplications: async () => {
        return await api.get('/settings/applications');
    },

    deleteApplication: async (id) => {
        return await api.delete(`/settings/applications/${id}`);
    },

    clearAllApplications: async () => {
        return await api.delete('/settings/applications');
    },

    getAnnouncement: async () => {
        return await api.get('/settings/announcement');
    },

    updateAnnouncement: async (data) => {
        return await api.put('/settings/announcement', data);
    },

    deleteAnnouncementHistory: async (id) => {
        return await api.delete(`/settings/announcement/history/${id}`);
    }
};

export default settingsService;
