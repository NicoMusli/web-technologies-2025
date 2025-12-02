const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'web-tech-shop',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        public_id: (req, file) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            return uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '-').split('.')[0];
        }
    },
});

const uploadDir = path.join(__dirname, '../uploads');
if (require.main === module && !fs.existsSync(uploadDir)) {
    try {
        fs.mkdirSync(uploadDir, { recursive: true });
    } catch (err) {
        console.warn('Could not create uploads directory (expected in serverless environment)');
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

module.exports = upload;
