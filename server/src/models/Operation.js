const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  stepIndex: Number,
  severity: String,  // 'error', 'warning', 'info'
  message: String,
  suggestion: String
});

const StepSchema = new mongoose.Schema({
  order: Number,
  componentId: String,
  action: String,  // 'open', 'close', 'transfer', etc.
  properties: {
    type: mongoose.Schema.Types.Mixed
  }
});

const OperationSchema = new mongoose.Schema({
  diagramId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Diagram'
  },
  name: String,
  createdDate: {
    type: Date,
    default: Date.now
  },
  steps: [StepSchema],
  validationResults: {
    isValid: Boolean,
    issues: [IssueSchema]
  }
});

module.exports = mongoose.model('Operation', OperationSchema);