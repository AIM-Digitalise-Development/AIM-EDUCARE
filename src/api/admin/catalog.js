import { api } from '../client';

export const adminCatalogApi = {
  // Categories
  getCategories: () => api.get('/api/admin/exam-categories'),
  getCategory: (id) => api.get(`/api/admin/exam-categories/${id}`),
  createCategory: (data) => api.post('/api/admin/exam-categories', data),
  updateCategory: (id, data) => api.put(`/api/admin/exam-categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/api/admin/exam-categories/${id}`),

  // Exams
  getExams: (params) => api.get('/api/admin/exams', { params }),
  getExam: (id) => api.get(`/api/admin/exams/${id}`),
  createExam: (data) => api.post('/api/admin/exams', data),
  updateExam: (id, data) => api.put(`/api/admin/exams/${id}`, data),
  deleteExam: (id) => api.delete(`/api/admin/exams/${id}`),

  // Subjects
  getSubjects: (examId) => api.get(`/api/admin/exams/${examId}/subjects`),
  getSubject: (examId, subjectId) => api.get(`/api/admin/exams/${examId}/subjects/${subjectId}`),
  createSubject: (examId, data) => api.post(`/api/admin/exams/${examId}/subjects`, data),
  updateSubject: (examId, subjectId, data) => api.put(`/api/admin/exams/${examId}/subjects/${subjectId}`, data),
  deleteSubject: (examId, subjectId) => api.delete(`/api/admin/exams/${examId}/subjects/${subjectId}`),

  // Topics
  getTopics: (subjectId) => api.get(`/api/admin/subjects/${subjectId}/topics`),
  getTopic: (subjectId, topicId) => api.get(`/api/admin/subjects/${subjectId}/topics/${topicId}`),
  createTopic: (subjectId, data) => api.post(`/api/admin/subjects/${subjectId}/topics`, data),
  updateTopic: (subjectId, topicId, data) => api.put(`/api/admin/subjects/${subjectId}/topics/${topicId}`, data),
  deleteTopic: (subjectId, topicId) => api.delete(`/api/admin/subjects/${subjectId}/topics/${topicId}`),
};