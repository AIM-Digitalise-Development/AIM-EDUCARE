import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const isAdminPath = config.url?.startsWith('/api/admin');
  const token = isAdminPath
    ? useAdminAuthStore.getState().token
    : useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isAdminPath = url.startsWith('/api/admin');

    if (status === 401) {
      if (isAdminPath) {
        useAdminAuthStore.getState().logout();
        if (window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login';
        }
      } else {
        useAuthStore.getState().logout();
        if (!['/login', '/register'].includes(window.location.pathname)) {
          window.location.href = '/login';
        }
      }
    }

    if (status === 403) toast.error('You do not have permission for this action.');
    if (status === 429) toast.error('Too many requests. Please slow down.');
    if (status >= 500) toast.error('Server error. Please try again.');

    return Promise.reject(error);
  }
);

export const API_BASE = API_URL;