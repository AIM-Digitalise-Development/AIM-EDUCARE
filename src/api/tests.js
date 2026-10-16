import { api } from './client';

export const testsApi = {
  getTest: (id) => api.get(`/api/tests/${id}`),
  startTest: (id) => api.post(`/api/tests/${id}/start`),
};