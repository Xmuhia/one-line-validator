const Operation = require('../models/Operation');
const Diagram = require('../models/Diagram');
const ValidationEngine = require('../services/validationEngine');
const XLSX = require('xlsx');

// Parse Excel file and create operations
exports.createOperation = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    if (!req.body.diagramId) {
      return res.status(400).json({ message: 'Diagram ID is required' });
    }
    
    // Get the diagram
    const diagram = await Diagram.findById(req.body.diagramId);
    if (!diagram) {
      return res.status(404).json({ message: 'Diagram not found' });
    }
    
    // Read Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    // Transform Excel data to operation steps
    const steps = data.map((row, index) => ({
      order: index + 1,
      componentId: row.componentId,
      action: row.action,
      properties: {
        notes: row.notes || ''
      }
    }));
    
    // Create new operation
    const operation = new Operation({
      diagramId: req.body.diagramId,
      name: req.body.name || 'Untitled Operation',
      steps
    });
    
    // Validate operation
    const validationEngine = new ValidationEngine(diagram, operation);
    operation.validationResults = validationEngine.validateBasic();
    
    await operation.save();
    
    res.status(201).json({
      message: 'Operation created and validated successfully',
      operation
    });
  } catch (error) {
    console.error('Error creating operation:', error);
    res.status(500).json({
      message: 'Error creating operation',
      error: error.message
    });
  }
};

// Get all operations
exports.getAllOperations = async (req, res) => {
  try {
    const operations = await Operation.find({})
      .select('name diagramId createdDate validationResults.isValid')
      .populate('diagramId', 'name');
      
    res.status(200).json(operations);
  } catch (error) {
    console.error('Error fetching operations:', error);
    res.status(500).json({
      message: 'Error fetching operations',
      error: error.message
    });
  }
};

// Get operation by ID
exports.getOperationById = async (req, res) => {
  try {
    const operation = await Operation.findById(req.params.id)
      .populate('diagramId');
      
    if (!operation) {
      return res.status(404).json({ message: 'Operation not found' });
    }
    
    res.status(200).json(operation);
  } catch (error) {
    console.error('Error fetching operation:', error);
    res.status(500).json({
      message: 'Error fetching operation',
      error: error.message
    });
  }
};

// Validate operation (different validation levels)
exports.validateOperation = async (req, res) => {
  try {
    const { operationId, level } = req.params;
    
    const operation = await Operation.findById(operationId);
    if (!operation) {
      return res.status(404).json({ message: 'Operation not found' });
    }
    
    const diagram = await Diagram.findById(operation.diagramId);
    if (!diagram) {
      return res.status(404).json({ message: 'Associated diagram not found' });
    }
    
    const validationEngine = new ValidationEngine(diagram, operation);
    let validationResults;
    
    switch (level) {
      case 'basic':
        validationResults = validationEngine.validateBasic();
        break;
      case 'logical':
        validationResults = validationEngine.validateLogical();
        break;
      case 'advanced':
        validationResults = validationEngine.validateAdvanced();
        break;
      default:
        validationResults = validationEngine.validateBasic();
    }
    
    // Update operation with validation results
    operation.validationResults = validationResults;
    await operation.save();
    
    res.status(200).json({
      message: `Operation validated successfully (level: ${level})`,
      validationResults
    });
  } catch (error) {
    console.error('Error validating operation:', error);
    res.status(500).json({
      message: 'Error validating operation',
      error: error.message
    });
  }
};

// Delete operation
exports.deleteOperation = async (req, res) => {
  try {
    const operation = await Operation.findById(req.params.id);
    if (!operation) {
      return res.status(404).json({ message: 'Operation not found' });
    }
    
    await operation.remove();
    res.status(200).json({ message: 'Operation deleted successfully' });
  } catch (error) {
    console.error('Error deleting operation:', error);
    res.status(500).json({
      message: 'Error deleting operation',
      error: error.message
    });
  }
};