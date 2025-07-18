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


const uploadMultipleImages = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            res.status(400).json({ status: false, message: "No images provided", data: null });
        }

        const uploadPromises = req.files.map(async (file) => {
            const [originalUrl, thumbnailUrl] = await Promise.all([
                ImageUploadHelper.processAndSaveImage(file, {
                    width: 800,
                    format: 'png',
                    quality: 80,
                    user: req?.user
                }),
                ImageUploadHelper.processAndSaveImage(file, {
                    width: 200,
                    format: 'png',
                    quality: 70,
                    user: req?.user
                })
            ]);

            return {
                original: process.env.BASE_URL + originalUrl,
                thumbnail: process.env.BASE_URL + thumbnailUrl
            };
        });

        const results = await Promise.all(uploadPromises);
        res.status(200).json({ status: true, message: "Images uploaded successfully", data: results });

    } catch (error) {
        if (error.message.includes('File too large')) {
            res.status(400).json({ status: false, message: "Each image size should not exceed 2MB", data: null });
        }
        next(error);
    }
}

module.exports = { uploadSingleImage, uploadMultipleImages }; 