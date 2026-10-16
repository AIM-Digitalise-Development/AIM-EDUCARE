import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuthStore } from '@/stores/adminAuthStore';

export default function RequireAdmin() {
  const isAuth = useAdminAuthStore((s) => s.isAuthenticated)();
  if (!isAuth) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}