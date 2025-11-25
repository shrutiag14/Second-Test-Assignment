import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: number;
  username: string;
}

export interface Calculation {
  id: number;
  user_id: number;
  username: string;
  parent_id: number | null;
  is_starting_number: boolean;
  operation: string | null;
  operand: number | null;
  result: number;
  created_at: string;
}

export const authAPI = {
  register: async (username: string, password: string) => {
    const response = await api.post('/auth/register', { username, password });
    return response.data;
  },
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
};

export const calculationAPI = {
  getTree: async (): Promise<Calculation[]> => {
    const response = await api.get('/calculations/tree');
    return response.data;
  },
  createStartingNumber: async (number: number): Promise<Calculation> => {
    const response = await api.post('/calculations/start', { number });
    return response.data;
  },
  addOperation: async (
    parentId: number,
    operation: string,
    operand: number
  ): Promise<Calculation> => {
    const response = await api.post('/calculations/operation', {
      parentId,
      operation,
      operand,
    });
    return response.data;
  },
};
