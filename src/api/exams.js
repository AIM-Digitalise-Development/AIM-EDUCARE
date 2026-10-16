import { api } from './client';

export const examsApi = {
  getCategories: () => api.get('/api/exam-categories'),
  getExams: (params) => api.get('/api/exams', { params }),
  getExamDetail: (slug) => api.get(`/api/exams/${slug}`),
  getExamPlans: (slug) => api.get(`/api/exams/${slug}/plans`),
  getExamPublicTests: (slug) => api.get(`/api/exams/${slug}/tests`),
  getMyExams: () => api.get('/api/my/exams'),
  getMyExamTests: (slug) => api.get(`/api/my/exams/${slug}/tests`),
};