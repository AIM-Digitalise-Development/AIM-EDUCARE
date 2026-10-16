import { api } from '../client';

export const adminOrdersApi = {
  getOrders: (params) => api.get('/api/admin/orders', { params }),
  getOrder: (id) => api.get(`/api/admin/orders/${id}`),
  getTransactions: (params) => api.get('/api/admin/transactions', { params }),
};