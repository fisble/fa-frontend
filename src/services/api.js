import axios from 'axios';

// Allow runtime override of the backend API URL so deployed frontend
// can be pointed to any backend without rebuilding.
function resolveBaseUrl() {
  // 1) explicit runtime global (injected by hosting) e.g. window.__FA_API_URL
  if (typeof window !== 'undefined' && window.__FA_API_URL) return window.__FA_API_URL;
  // 2) user-saved override in localStorage
  try {
    const saved = (typeof window !== 'undefined') && window.localStorage && window.localStorage.getItem('FA_API_URL');
    if (saved) return saved;
  } catch (e) { /* ignore */ }
  // 3) build-time env var configured in Vercel
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  // 4) fallback to localhost (use during local development)
  return 'http://localhost:5000/api';
}

const api = axios.create({
  baseURL: resolveBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const currentBase = resolveBaseUrl();
  if (config.baseURL !== currentBase) {
    config.baseURL = currentBase;
  }
  return config;
});

export function setApiUrl(url) {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem('FA_API_URL', url);
    } catch (e) {
      console.warn('Cannot save API URL', e);
    }
  }
  api.defaults.baseURL = url || resolveBaseUrl();
}

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
