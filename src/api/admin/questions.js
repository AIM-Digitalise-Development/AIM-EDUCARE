import { api } from '../client';

export const adminQuestionsApi = {
  getQuestions: (params) => api.get('/api/admin/questions', { params }),
  getQuestion: (id) => api.get(`/api/admin/questions/${id}`),
  createQuestion: (data) => api.post('/api/admin/questions', data),
  updateQuestion: (id, data) => api.put(`/api/admin/questions/${id}`, data),
  deleteQuestion: (id) => api.delete(`/api/admin/questions/${id}`),
  bulkUpload: (formData) =>
    api.post('/api/admin/questions/bulk-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};