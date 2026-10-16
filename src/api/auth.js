import { api } from './client';

export const authApi = {
  register: (payload) => api.post('/api/register', payload),
  login: (credentials) => api.post('/api/login', credentials),
  logout: () => api.post('/api/logout'),
  getProfile: () => api.get('/api/profile'),
  updateProfile: (payload) => api.put('/api/profile', payload),
};