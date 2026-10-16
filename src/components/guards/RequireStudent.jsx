import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export default function RequireStudent() {
  const isAuth = useAuthStore((s) => s.isAuthenticated)();
  const location = useLocation();
  if (!isAuth) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}