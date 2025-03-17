const mongoose = require('mongoose');

const ComponentSchema = new mongoose.Schema({
  id: String,
  type: String,  // 'breaker', 'transformer', 'bus', etc.
  position: {
    x: Number,
    y: Number
  },
  properties: {
    type: mongoose.Schema.Types.Mixed
  }
});

const ConnectionSchema = new mongoose.Schema({
  from: String,  // Component ID
  to: String,    // Component ID
  type: String   // Connection type
});

const DiagramSchema = new mongoose.Schema({
  name: String,
  filePath: String,
  fileType: String,
  uploadDate: {
    type: Date,
    default: Date.now
  },
  components: [ComponentSchema],
  connections: [ConnectionSchema]
});

module.exports = mongoose.model('Diagram', DiagramSchema);