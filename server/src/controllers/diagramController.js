const DiagramParser = require('../services/diagramParser');
const Diagram = require('../models/Diagram');

// Upload and parse diagram
exports.uploadDiagram = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const parser = new DiagramParser(req.file.path);
    const parsedDiagram = await parser.parse();
    
    const diagram = new Diagram(parsedDiagram);
    await diagram.save();
    
    res.status(201).json({
      message: 'Diagram uploaded and parsed successfully',
      diagram
    });
  } catch (error) {
    console.error('Error uploading diagram:', error);
    res.status(500).json({
      message: 'Error uploading diagram',
      error: error.message
    });
  }
};

// Get all diagrams
exports.getAllDiagrams = async (req, res) => {
  try {
    const diagrams = await Diagram.find({}).select('name uploadDate');
    res.status(200).json(diagrams);
  } catch (error) {
    console.error('Error fetching diagrams:', error);
    res.status(500).json({
      message: 'Error fetching diagrams',
      error: error.message
    });
  }
};

// Get diagram by ID
exports.getDiagramById = async (req, res) => {
  try {
    const diagram = await Diagram.findById(req.params.id);
    if (!diagram) {
      return res.status(404).json({ message: 'Diagram not found' });
    }
    res.status(200).json(diagram);
  } catch (error) {
    console.error('Error fetching diagram:', error);
    res.status(500).json({
      message: 'Error fetching diagram',
      error: error.message
    });
  }
};

// Delete diagram
exports.deleteDiagram = async (req, res) => {
  try {
    const diagram = await Diagram.findById(req.params.id);
    if (!diagram) {
      return res.status(404).json({ message: 'Diagram not found' });
    }
    
    // Delete the file if it exists
    const fs = require('fs');
    if (diagram.filePath && fs.existsSync(diagram.filePath)) {
      fs.unlinkSync(diagram.filePath);
    }
    
    await diagram.remove();
    res.status(200).json({ message: 'Diagram deleted successfully' });
  } catch (error) {
    console.error('Error deleting diagram:', error);
    res.status(500).json({
      message: 'Error deleting diagram',
      error: error.message
    });
  }
};