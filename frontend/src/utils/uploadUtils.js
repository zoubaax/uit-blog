export const uploadToCloudinary = async (file) => {
    if (!file) return null;

    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl) {
        console.error("API URL missing in frontend .env");
        throw new Error("Configuration Error");
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${apiUrl}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Upload Error Detail:", errorData);
            throw new Error(errorData.message || 'Image upload failed');
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Upload Error:", error);
        throw error;
    }
};
