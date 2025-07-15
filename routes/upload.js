const express = require('express');
const router = express.Router();

const { uploadSingleImage, uploadMultipleImages } = require('../controllers/uploadController');
const ImageUploadHelper = require('../utils/imageHelper');

router.post('/upload', ImageUploadHelper.getUploadMiddleware(), uploadSingleImage);
router.post('/uploads', ImageUploadHelper.getMultipleUploadMiddleware(), uploadMultipleImages);

module.exports = router; 