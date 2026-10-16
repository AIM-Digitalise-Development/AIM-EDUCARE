import { api } from './client';

export const attemptsApi = {
  saveAnswerSheet: (id, answerSheet) =>
    api.post(`/api/attempts/${id}/save`, { answer_sheet: answerSheet }),
  submitAttempt: (id, payload) =>
    api.post(`/api/attempts/${id}/submit`, payload),
  getResult: (id) => api.get(`/api/attempts/${id}/result`),
};