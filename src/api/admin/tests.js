import { api } from '../client';

export const adminTestsApi = {
  getTests: (params) => api.get('/api/admin/tests', { params }),
  getTest: (id) => api.get(`/api/admin/tests/${id}`),
  createTest: (data) => api.post('/api/admin/tests', data),
  updateTest: (id, data) => api.put(`/api/admin/tests/${id}`, data),
  deleteTest: (id) => api.delete(`/api/admin/tests/${id}`),

  addSection: (testId, data) => api.post(`/api/admin/tests/${testId}/sections`, data),
  addQuestions: (testId, data) => api.post(`/api/admin/tests/${testId}/questions`, data),
  removeQuestion: (testId, qid) => api.delete(`/api/admin/tests/${testId}/questions/${qid}`),

  publishTest: (testId) => api.post(`/api/admin/tests/${testId}/publish`),
  scheduleLive: (testId, data) => api.post(`/api/admin/tests/${testId}/schedule-live`, data),
};