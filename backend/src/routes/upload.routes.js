const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const router = express.Router();

// Multer config: store file in memory buffer (no disk writes)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
});

// POST /api/v1/upload
router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file provided' });
        }

        // Upload buffer to Cloudinary via stream
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'uit-blog',
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        res.status(200).json({
            secure_url: result.secure_url,
            public_id: result.public_id,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Image upload failed', error: error.message });
    }
});

module.exports = router;
