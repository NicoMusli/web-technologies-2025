const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

router.post('/', upload.array('files'), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const urls = req.files.map(file => file.path);
        res.status(200).json({ urls });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Error uploading files' });
    }
});

module.exports = router;
