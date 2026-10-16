import { api } from '../client';

export const adminAuditLogsApi = {
  getLogs: (params) => api.get('/api/admin/audit-logs', { params }),
};