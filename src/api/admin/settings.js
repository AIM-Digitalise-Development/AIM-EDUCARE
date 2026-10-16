import { api } from '../client';

export const adminSettingsApi = {
  getSettings: () => api.get('/api/admin/settings'),
  updateSettings: (settings) => api.put('/api/admin/settings', { settings }),
};