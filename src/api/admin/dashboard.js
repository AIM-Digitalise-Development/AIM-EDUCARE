import { api } from '../client';

export const adminDashboardApi = {
  getStats: () => api.get('/api/admin/dashboard'),
};