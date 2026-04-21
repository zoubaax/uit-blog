import api from '../services/api';

export const uploadToCloudinary = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // The 'api' service (axios interceptor) returns response.data directly
        return response.secure_url;
    } catch (error) {
        console.error("Upload Error:", error);
        throw error;
    }
};
