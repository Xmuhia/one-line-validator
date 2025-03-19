const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const operationController = require('../controllers/operationController');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads/operations');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/operations'));
  },
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now();
    cb(null, `${uniquePrefix}-${file.originalname}`);
  }
});

// Configure file filter to accept only Excel and CSV files
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = [
    'application/vnd.ms-excel',                     // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'text/csv'                                      // .csv
  ];
  
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only Excel and CSV files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB limit
  }
});

// Routes
router.post('/', upload.single('operation'), operationController.createOperation);
router.get('/', operationController.getAllOperations);
router.get('/diagram/:diagramId', operationController.getOperationsByDiagram);
router.get('/:id', operationController.getOperationById);
router.post('/:id/validate', operationController.validateOperation);

module.exports = router;