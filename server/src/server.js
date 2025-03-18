const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

//Environment variables
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;


connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//File storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Make uploads directory accessible
app.use('/uploads', express.static('uploads'));

// Root route handler
app.get('/', (req, res) => {
  res.send('One-Line Diagram Validator API is running');
});

// Routes
app.use('/api', apiRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});