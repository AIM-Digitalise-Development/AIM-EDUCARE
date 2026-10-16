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
  ExternalLink,
  Activity
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, permission: null },
  { label: 'Exam Categories', path: '/admin/exam-categories', icon: FolderTree, permission: 'admin_only' },
  { label: 'Exams Catalog', path: '/admin/exams', icon: GraduationCap, permission: 'admin_only' },
  { label: 'Question Bank', path: '/admin/questions', icon: HelpCircle, permission: 'upload_questions' },
  { label: 'Test Builder & Mocks', path: '/admin/tests', icon: FileText, permission: ['create_test', 'publish_test'] },
  { label: 'Subscription Plans', path: '/admin/plans', icon: CreditCard, permission: 'manage_plans' },
  { label: 'Candidates & Users', path: '/admin/users', icon: Users, permission: 'manage_users' },
  { label: 'Sub-Admins', path: '/admin/sub-admins', icon: ShieldCheck, permission: 'manage_subadmins' },
  { label: 'Orders & Payments', path: '/admin/orders', icon: ShoppingBag, permission: 'manage_orders' },
  { label: 'Transactions', path: '/admin/transactions', icon: Receipt, permission: 'manage_orders' },
  { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileSpreadsheet, permission: 'view_reports' },
  { label: 'Platform Settings', path: '/admin/settings', icon: Settings, permission: 'admin_only' },
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
    <div className="min-h-screen flex bg-slate-100/60 text-slate-900 font-sans">
      {/* Sleek Dark Navy Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col shrink-0 shadow-xl z-20">
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800 bg-slate-950">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              AimEducare
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-400 -mt-0.5">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Quick status widget */}
        <div className="px-4 py-2.5 mx-3 my-3 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-[11px]">CBT Engine Online</span>
          </div>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono font-bold">
            v2.1
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-1 py-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path === '/admin/dashboard' && location.pathname === '/admin');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-md shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800 border border-slate-700">
            <div className="truncate mr-2">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                <p className="text-[10px] text-slate-400 capitalize">{user?.role || 'admin'}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout} 
              title="Sign Out" 
              className="h-8 w-8 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shadow-xs sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-600" />
              <span>AimEducare Administration</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-slate-600 hover:text-indigo-600 flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
            >
              <span>View Portal</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
              {user?.role === 'admin' ? 'Super Administrator' : 'Sub-Admin'}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors">
              <LogOut className="mr-1.5 h-3.5 w-3.5" />
              Log Out
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}