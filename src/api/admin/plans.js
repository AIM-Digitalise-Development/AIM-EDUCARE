import { api } from '../client';

export const adminPlansApi = {
  getPlans: (params) => api.get('/api/admin/plans', { params }),
  getPlan: (id) => api.get(`/api/admin/plans/${id}`),
  createPlan: (data) => api.post('/api/admin/plans', data),
  updatePlan: (id, data) => api.put(`/api/admin/plans/${id}`, data),
  deletePlan: (id) => api.delete(`/api/admin/plans/${id}`),
};