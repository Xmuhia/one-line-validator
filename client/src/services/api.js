import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Diagram API
export const getDiagrams = async () => {
  const response = await api.get('/diagrams');
  return response.data;
};

export const getDiagram = async (id) => {
  const response = await api.get(`/diagrams/${id}`);
  return response.data;
};

export const uploadDiagram = async (formData) => {
  const response = await api.post('/diagrams', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const deleteDiagram = async (id) => {
  const response = await api.delete(`/diagrams/${id}`);
  return response.data;
};

// Operation API
export const getOperations = async () => {
  const response = await api.get('/operations');
  return response.data;
};

export const getOperation = async (id) => {
  const response = await api.get(`/operations/${id}`);
  return response.data;
};

export const createOperation = async (formData) => {
  const response = await api.post('/operations', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const deleteOperation = async (id) => {
  const response = await api.delete(`/operations/${id}`);
  return response.data;
};

// Validation API
export const validateOperation = async (operationId, level) => {
  const response = await api.post(`/validation/${level}/${operationId}`);
  return response.data;
};

export default api;