import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const stockService = {
  getAll: () => api.get('/stocks'),
};

export const tradeService = {
  execute: (tradeData) => api.post('/trade', tradeData),
};

export const portfolioService = {
  get: () => api.get('/portfolio'),
};

export default api;
