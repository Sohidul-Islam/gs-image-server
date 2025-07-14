const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Import routes
const uploadRoute = require('./routes/upload');

// Use routes
app.use('/', uploadRoute);

// Serve uploaded files statically
app.use('/gs-image', express.static(path.join(__dirname, '/public/uploads')));

// Error handler
app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 