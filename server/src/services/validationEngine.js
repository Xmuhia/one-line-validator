class ValidationEngine {
    constructor(diagram, operations) {
      this.diagram = diagram;
      this.operations = operations;
      this.components = new Map();
      
      // Initialize component state from diagram
      diagram.components.forEach(comp => {
        this.components.set(comp.id, { ...comp });
      });
    }
    
    validateBasic() {
      // Level 1: Basic validation
      const issues = [];
      
      // Check if all components in operations exist in diagram
      this.operations.steps.forEach((step, index) => {
        if (!this.components.has(step.componentId)) {
          issues.push({
            stepIndex: index,
            severity: 'error',
            message: `Component ${step.componentId} does not exist in the diagram`,
            suggestion: 'Check component ID'
          });
        }
      });
      
      return {
        isValid: issues.length === 0,
        issues
      };
    }
    
    validateLogical() {
      // Level 2: Logical validation
      const issues = this.validateBasic().issues;
      const componentStates = new Map();
      
      // Initialize component states
      this.diagram.components.forEach(comp => {
        componentStates.set(comp.id, comp.properties?.state || 'unknown');
      });
      
      // Check sequence logic
      this.operations.steps.forEach((step, index) => {
        const component = this.components.get(step.componentId);
        
        if (component?.type === 'breaker') {
          // Check breaker state before operation
          if (step.action === 'open' && componentStates.get(step.componentId) === 'open') {
            issues.push({
              stepIndex: index,
              severity: 'warning',
              message: `Breaker ${step.componentId} is already open`,
              suggestion: 'Skip this step or verify breaker state'
            });
          } else if (step.action === 'close' && componentStates.get(step.componentId) === 'closed') {
            issues.push({
              stepIndex: index,
              severity: 'warning',
              message: `Breaker ${step.componentId} is already closed`,
              suggestion: 'Skip this step or verify breaker state'
            });
          }
          
          // Update component state
          componentStates.set(step.componentId, step.action === 'open' ? 'open' : 'closed');
        }
      });
      
      return {
        isValid: issues.length === 0,
        issues
      };
    }
    
    validateAdvanced() {
      // Level 3: Advanced validation
      const result = this.validateLogical();
      const issues = result.issues;
      
      // Simulate the sequence step by step to check for circuit continuity
      const componentStates = new Map();
      
      // Initialize component states
      this.diagram.components.forEach(comp => {
        componentStates.set(comp.id, {
          ...comp.properties,
          energized: comp.type === 'bus' ? true : false // Assume buses start energized
        });
      });
      
      // For each step, update the state and check for issues
      this.operations.steps.forEach((step, index) => {
        // Update state based on action
        if (step.action === 'open' || step.action === 'close') {
          componentStates.set(step.componentId, {
            ...componentStates.get(step.componentId),
            state: step.action === 'open' ? 'open' : 'closed'
          });
          
          // Check for circuit continuity after state change
          const continuityIssues = this.checkCircuitContinuity(componentStates);
          if (continuityIssues.length > 0) {
            issues.push({
              stepIndex: index,
              severity: 'error',
              message: `Step causes loss of circuit continuity: ${continuityIssues[0]}`,
              suggestion: 'Consider changing the sequence of operations'
            });
          }
        }
      });
      
      return {
        isValid: issues.length === 0,
        issues
      };
    }
    
    checkCircuitContinuity(componentStates) {
      // Simplified circuit continuity check
      const issues = [];
      
      // Check if any bus is isolated
      this.diagram.components.forEach(comp => {
        if (comp.type === 'bus') {
          const connectedComponents = this.getConnectedComponents(comp.id);
          const hasPath = connectedComponents.some(connId => {
            const conn = this.components.get(connId);
            return conn.type === 'breaker' && 
                   componentStates.get(connId)?.state === 'closed';
          });
          
          if (!hasPath) {
            issues.push(`Bus ${comp.id} is isolated`);
          }
        }
      });
      
      return issues;
    }
    
    getConnectedComponents(componentId) {
      // Get all components directly connected to the given component
      const connected = [];
      
      this.diagram.connections.forEach(conn => {
        if (conn.from === componentId) {
          connected.push(conn.to);
        } else if (conn.to === componentId) {
          connected.push(conn.from);
        }
      });
      
      return connected;
    }
  }
  
  module.exports = ValidationEngine;
  