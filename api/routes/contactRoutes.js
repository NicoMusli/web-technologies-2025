const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    res.json({ message: 'Message sent successfully' });
});

module.exports = router;
