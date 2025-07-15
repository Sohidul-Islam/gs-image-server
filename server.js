const express = require('express');
const path = require('path');
var cors = require('cors')

const app = express();
const PORT = process.env.PORT || 8000;

// Import routes
const uploadRoute = require('./routes/upload');


var whitelist = ['https://fashionglory-gaming.vercel.app', 'https://gs-admin-console.vercel.app']
var corsOptionsDelegate = function (req, callback) {

    const origin = req.header('Origin');
    var corsOptions;
    if (whitelist.indexOf(origin) !== -1) {
        corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    }
    else if (origin?.includes("localhost")) {
        corsOptions = { origin: true }
    }
    else {
        corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(corsOptionsDelegate))

// Use routes
app.use('/', uploadRoute);

// Serve uploaded files statically
app.use('/gs-image', express.static(path.join(__dirname, '/public/uploads')));

// Error handler
app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message, errors: err });
});

app.get("/", (req, res) => {

    res.send("Welcome to gs image server")
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 