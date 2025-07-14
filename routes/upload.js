const express = require('express');
const router = express.Router();

const { uploadSingleImage } = require('../controllers/uploadController');
const ImageUploadHelper = require('../utils/imageHelper');

router.post('/upload', ImageUploadHelper.getUploadMiddleware(), uploadSingleImage);

module.exports = router; 