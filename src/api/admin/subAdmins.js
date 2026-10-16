import { api } from '../client';

export const adminSubAdminsApi = {
  getSubAdmins: () => api.get('/api/admin/sub-admins'),
  getSubAdmin: (id) => api.get(`/api/admin/sub-admins/${id}`),
  createSubAdmin: (data) => api.post('/api/admin/sub-admins', data),
  updateSubAdmin: (id, data) => api.put(`/api/admin/sub-admins/${id}`, data),
  deleteSubAdmin: (id) => api.delete(`/api/admin/sub-admins/${id}`),
  updatePermissions: (id, permissions) =>
    api.post(`/api/admin/sub-admins/${id}/permissions`, { permissions }),
};