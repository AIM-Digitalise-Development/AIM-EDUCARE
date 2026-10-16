import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FolderTree,
  GraduationCap,
  HelpCircle,
  FileText,
  CreditCard,
  Users,
  ShieldCheck,
  ShoppingBag,
  Receipt,
  FileSpreadsheet,
  Settings,
  LogOut,
  ShieldAlert,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, permission: null },
  { label: 'Exam Categories', path: '/admin/exam-categories', icon: FolderTree, permission: 'manage_categories' },
  { label: 'Exams', path: '/admin/exams', icon: GraduationCap, permission: 'manage_exams' },
  { label: 'Questions', path: '/admin/questions', icon: HelpCircle, permission: 'manage_questions' },
  { label: 'Tests', path: '/admin/tests', icon: FileText, permission: 'manage_tests' },
  { label: 'Plans', path: '/admin/plans', icon: CreditCard, permission: 'manage_plans' },
  { label: 'Users', path: '/admin/users', icon: Users, permission: 'manage_users' },
  { label: 'Sub-Admins', path: '/admin/sub-admins', icon: ShieldCheck, permission: 'manage_subadmins' },
  { label: 'Orders', path: '/admin/orders', icon: ShoppingBag, permission: 'view_orders' },
  { label: 'Transactions', path: '/admin/transactions', icon: Receipt, permission: 'view_transactions' },
  { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileSpreadsheet, permission: 'view_audit_logs' },
  { label: 'Settings', path: '/admin/settings', icon: Settings, permission: 'manage_settings' },
];

export default function AdminLayout() {
  const user = useAdminAuthStore((s) => s.user);
  const logout = useAdminAuthStore((s) => s.logout);
  const hasPermission = useAdminAuthStore((s) => s.hasPermission);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const visibleItems = navItems.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  return (
    <div className="min-h-screen flex bg-muted/10 text-foreground">
      {/* Left Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col shrink-0">
        <div className="h-16 flex items-center gap-2.5 px-6 border-b">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <span className="font-bold text-lg tracking-tight">Admin Portal</span>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path === '/admin/dashboard' && location.pathname === '/admin');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <p className="text-sm font-medium truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role || 'admin'}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Log out">
              <LogOut className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <h2 className="text-sm font-medium text-muted-foreground">
            AimEducare Administration
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
              {user?.role === 'admin' ? 'Super Admin' : 'Sub-Admin'}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}