/**
 * Helper utilities for client-side image cropping and canvas rendering
 */

export const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

function calculateBoundingBox(width, height, rotation) {
    const rad = (rotation * Math.PI) / 180;
    return {
        width: Math.abs(Math.cos(rad) * width) + Math.abs(Math.sin(rad) * height),
        height: Math.abs(Math.sin(rad) * width) + Math.abs(Math.cos(rad) * height),
    };
}

/**
 * Returns a high-res cropped File from image source and crop coordinates
 */
export async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
    const image = await createImage(imageSrc);

    // If no rotation, crop directly
    if (!rotation || rotation === 0) {
        const canvas = document.createElement('canvas');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) return null;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                resolve(new File([blob], 'avatar.jpg', { type: 'image/jpeg' }));
            }, 'image/jpeg', 0.95);
        });
    }

    // With rotation
    const { width: bBoxWidth, height: bBoxHeight } = calculateBoundingBox(image.width, image.height, rotation);
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = bBoxWidth;
    tempCanvas.height = bBoxHeight;

    const rotRad = (rotation * Math.PI) / 180;
    tempCtx.translate(bBoxWidth / 2, bBoxHeight / 2);
    tempCtx.rotate(rotRad);
    tempCtx.translate(-image.width / 2, -image.height / 2);
    tempCtx.drawImage(image, 0, 0);

    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    ctx.drawImage(
        tempCanvas,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Canvas is empty'));
                return;
            }
            resolve(new File([blob], 'avatar.jpg', { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.95);
    });
}
