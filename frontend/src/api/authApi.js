import axios from 'axios';
import { store } from '../store/store';

const resolveBaseUrl = () => import.meta.env.VITE_BACKEND_URL || '';

const api = axios.create({ baseURL: resolveBaseUrl() });

api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state?.auth?.token;
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

export const login = (data) => api.post('/api/auth/login', data);
export const register = (data) => api.post('/api/auth/register', data);

export default api;
