import { writable } from 'svelte/store';
import { getDiagrams, getDiagram } from '../services/api';

// Initialize store
const createDiagramStore = () => {
  const { subscribe, set, update } = writable({
    diagrams: [],
    currentDiagram: null,
    loading: false,
    error: null
  });
  
  return {
    subscribe,
    
    // Load all diagrams
    loadDiagrams: async () => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const diagrams = await getDiagrams();
        update(state => ({
          ...state,
          diagrams,
          loading: false
        }));
      } catch (error) {
        update(state => ({
          ...state,
          loading: false,
          error: error.message || 'Error loading diagrams'
        }));
      }
    },
    
    // Load a specific diagram by ID
    loadDiagram: async (id) => {
      update(state => ({ ...state, loading: true, error: null }));
      
      try {
        const diagram = await getDiagram(id);
        update(state => ({
          ...state,
          currentDiagram: diagram,
          loading: false
        }));
        return diagram;
      } catch (error) {
        update(state => ({
          ...state,
          loading: false,
          error: error.message || 'Error loading diagram'
        }));
        throw error;
      }
    },
    
    // Add a new diagram to the store
    addDiagram: (diagram) => {
      update(state => ({
        ...state,
        diagrams: [...state.diagrams, diagram],
        currentDiagram: diagram
      }));
    },
    
    // Reset the current diagram
    resetCurrentDiagram: () => {
      update(state => ({
        ...state,
        currentDiagram: null
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
export const diagramStore = createDiagramStore();
