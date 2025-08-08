// repair-draft.js

// Basic template for a JavaScript API handler

const express = require('express');
const router = express.Router();

// Example GET endpoint
router.get('/api/example', (req, res) => {
    res.json({ message: 'Hello from the API!' });
});

// Example POST endpoint
router.post('/api/example', (req, res) => {
    const data = req.body;
    // Handle data
    res.status(201).json({ message: 'Data received', data });
});

module.exports = router;