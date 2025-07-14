const ImageUploadHelper = require("../utils/imageHelper");
require('dotenv').config()

const uploadSingleImage = async (req, res, next) => {
    try {

        if (!req.file) {
            res.status(400).json({ status: false, message: "No image file provided", data: null });
        }

        // Process image with different sizes
        const [originalUrl, thumbnailUrl] = await Promise.all([
            // Original image (max width 800px)
            ImageUploadHelper.processAndSaveImage(req.file, {
                width: 800,
                format: 'png',
                quality: 80,
                user: req?.user
            }),
            // Thumbnail (width 200px)
            ImageUploadHelper.processAndSaveImage(req.file, {
                width: 200,
                format: 'png',
                quality: 70,
                user: req?.user
            })
        ]);

        res.status(200).json({
            status: true, message: "Image uploaded successfully",
            data: {
                original: process.env.BASE_URL + originalUrl,
                thumbnail: process.env.BASE_URL + thumbnailUrl
            }
        });

    } catch (error) {
        if (error.message.includes('File too large')) {
            res.status(400).json({ status: false, message: "Image size should not exceed 2MB", data: null });
        }
        next(error);
    }
}

module.exports = { uploadSingleImage }; 