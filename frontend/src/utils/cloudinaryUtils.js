/**
 * Cloudinary Transformation Utility
 * Helps reduce bandwidth by fetching correctly sized images
 */

export const getOptimizedImageUrl = (url, width = 800, height = null) => {
    if (!url || !url.includes('cloudinary.com')) return url;

    // Split at /upload/ to insert transformations
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;

    const transformation = height 
        ? `w_${width},h_${height},c_fill,q_auto,f_auto` 
        : `w_${width},c_limit,q_auto,f_auto`;

    return `${parts[0]}/upload/${transformation}/${parts[1]}`;
};
