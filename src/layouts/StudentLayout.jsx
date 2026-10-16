import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { GraduationCap, User, LogOut, BookOpen, Layers, ShoppingBag, Sparkles, Compass } from 'lucide-react';

export default function StudentLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-foreground font-sans">
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-700 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 bg-clip-text text-transparent">
                  AimEducare
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 -mt-1">
                  Candidate Portal
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
              <Link 
                to="/my-exams" 
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  isActive('/my-exams') 
                    ? 'text-indigo-600 bg-indigo-50 font-semibold' 
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70'
                }`}
              >
                My Test Series
              </Link>
              <Link 
                to="/my-plans" 
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  isActive('/my-plans') 
                    ? 'text-indigo-600 bg-indigo-50 font-semibold' 
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70'
                }`}
              >
                Active Passes
              </Link>
              <Link 
                to="/my-orders" 
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  isActive('/my-orders') 
                    ? 'text-indigo-600 bg-indigo-50 font-semibold' 
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70'
                }`}
              >
                Order History
              </Link>
              <Link 
                to="/exams" 
                className="px-3 py-1.5 rounded-lg transition-all text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70 flex items-center gap-1"
              >
                <Compass className="h-3.5 w-3.5 text-indigo-500" />
                <span>Browse All Exams</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-indigo-500/20 hover:ring-indigo-500/40 p-0 transition-all">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-bold text-xs">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none text-slate-900">{user?.name || 'Candidate'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/my-exams')} className="cursor-pointer">
                  <BookOpen className="mr-2 h-4 w-4 text-indigo-600" />
                  <span>My Test Series</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/my-plans')} className="cursor-pointer">
                  <Layers className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Active Passes</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/my-orders')} className="cursor-pointer">
                  <ShoppingBag className="mr-2 h-4 w-4 text-purple-600" />
                  <span>Orders & Invoices</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4 text-slate-600" />
                  <span>Candidate Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-4 sm:px-8 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-white font-bold text-xs">
              <GraduationCap className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-slate-800">AimEducare</span>
            <span>&bull; Student Test Center &amp; Mock Exam Portal</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} AimEducare Technologies. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}