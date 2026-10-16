import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAdminAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: () => !!get().token && !!get().user,
      hasPermission: (key) => {
        const u = get().user;
        if (!u) return false;
        if (u.role === 'admin') return true;
        return (u.permissions || []).includes(key);
      },
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'aimeducare-admin-auth' }
  )
);