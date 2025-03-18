import { writable } from 'svelte/store';
import { getOperations, getOperation } from '../services/api';

// Initialize store
const createOperationStore = () => {
  const { subscribe, set, update } = writable({
    operations: [],
    currentOperation: null,
    loading: false,
    error: null
  });
  
  return {
    subscribe,
    
    // Load all operations
    loadOperations: async () => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const operations = await getOperations();
        update(state => ({
          ...state,
          operations,
          loading: false
        }));
      } catch (error) {
        update(state => ({
          ...state,
          loading: false,
          error: error.message || 'Error loading operations'
        }));
      }
    },
    
    // Load a specific operation by ID
    loadOperation: async (id) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const operation = await getOperation(id);
        update(state => ({
          ...state,
          currentOperation: operation,
          loading: false
        }));
        return operation;
      } catch (error) {
        update(state => ({
          ...state,
          loading: false,
          error: error.message || 'Error loading operation'
        }));
        throw error;
      }
    },
    
    // Add a new operation to the store
    addOperation: (operation) => {
      update(state => ({
        ...state,
        operations: [...state.operations, operation],
        currentOperation: operation
      }));
    },
    
    // Update the current operation (e.g., after validation)
    updateCurrentOperation: (updatedOperation) => {
      update(state => ({
        ...state,
        currentOperation: updatedOperation,
        operations: state.operations.map(op => 
          op._id === updatedOperation._id ? updatedOperation : op
        )
      }));
    },
    
    // Reset the current operation
    resetCurrentOperation: () => {
      update(state => ({
        ...state,
        currentOperation: null
      }));
    },
    
    // Clear any errors
    clearError: () => {
      update(state => ({
        ...state,
        error: null
      }));
    }
  };
};

// Export the store
export const operationStore = createOperationStore();