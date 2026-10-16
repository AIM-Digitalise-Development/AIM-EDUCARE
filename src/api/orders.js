import { api } from './client';

export const ordersApi = {
  createOrder: (payload) => api.post('/api/orders', payload),
  getMyOrders: () => api.get('/api/my/orders'),
  getMyPlans: () => api.get('/api/my/plans'),
};