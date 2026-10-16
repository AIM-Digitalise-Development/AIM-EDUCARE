import { api } from '../client';

export const adminUsersApi = {
  getUsers: (params) => api.get('/api/admin/users', { params }),
  toggleBlock: (userId) => api.put(`/api/admin/users/${userId}/block`),
};