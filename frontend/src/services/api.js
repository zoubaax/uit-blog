import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        // Return the data directly, so we don't need .data in components
        return response.data;
    },
    (error) => {
        // Standardize error message
        const message = error.response?.data?.message || 'Something went wrong';

        // Auto-logout on 401 (Unauthorized)
        if (error.response && error.response.status === 401) {
            // Only redirect if not already on login page to avoid loops
            if (window.location.pathname !== '/login') {
                localStorage.removeItem('token');
                // Optional: Window reload or redirect
                // window.location.href = '/login'; 
            }
        }

        return Promise.reject(message);
    }
);

export default api;
