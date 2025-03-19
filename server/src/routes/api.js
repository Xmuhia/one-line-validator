const express = require('express');
const router = express.Router();
const multer = require('multer');
const diagramController = require('../controllers/diagramController');
const operationController = require('../controllers/operationController');

// Configure file storage for diagrams
const diagramStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/diagrams');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Configure file storage for operations
const operationStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/operations');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const uploadDiagram = multer({ storage: diagramStorage });
const uploadOperation = multer({ storage: operationStorage });

// Diagram routes
router.post('/diagrams', uploadDiagram.single('diagram'), diagramController.uploadDiagram);
router.get('/diagrams', diagramController.getAllDiagrams);
router.get('/diagrams/:id', diagramController.getDiagramById);
router.delete('/diagrams/:id', diagramController.deleteDiagram);

// Operation routes
router.post('/operations', uploadOperation.single('operation'), operationController.createOperation);
router.get('/operations', operationController.getAllOperations);
router.get('/operations/:id', operationController.getOperationById);
router.delete('/operations/:id', operationController.deleteOperation);

// Validation routes
router.post('/validation/:level/:operationId', operationController.validateOperation);

module.exports = router;