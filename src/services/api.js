import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const login = (payload) => api.post('/auth/login', payload);
export const register = (payload) => api.post('/auth/register', payload);
export const me = () => api.get('/auth/me');
export const fetchStudents = (params) => api.get('/students', { params });
export const fetchCompanies = (params) => api.get('/companies', { params });
export const fetchDrives = (params) => api.get('/drives', { params });
export const fetchApplications = (params) => api.get('/applications', { params });
export const fetchInterviews = (params) => api.get('/interviews', { params });
export const fetchStats = () => api.get('/stats');
export const syncDataset = (payload) => api.post('/sync/dataset', payload);

export default api;
