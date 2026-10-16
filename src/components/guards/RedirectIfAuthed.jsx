import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export default function RedirectIfAuthed({ to = '/my-exams' }) {
  const isAuth = useAuthStore((s) => s.isAuthenticated)();
  return isAuth ? <Navigate to={to} replace /> : <Outlet />;
}