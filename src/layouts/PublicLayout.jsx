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
import { 
  GraduationCap, 
  User, 
  LogOut, 
  BookOpen, 
  Layers, 
  Sparkles, 
  Zap, 
  ShieldCheck,
  CheckCircle2,
  Compass
} from 'lucide-react';

export default function PublicLayout() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)();
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
      {/* Top Banner Notice for CBT Simulation */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-indigo-100 py-1.5 px-4 text-xs font-medium text-center flex items-center justify-center gap-2 border-b border-indigo-700 shadow-inner">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>2026 Competitive Exam Series Live: Practice Real TCS-iON & NTA Pattern CBT Mock Tests</span>
        <Link to="/exams" className="underline hover:text-white ml-1 font-semibold flex items-center gap-1">
          Explore Mocks &rarr;
        </Link>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-700 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 bg-clip-text text-transparent">
                  AimEducare
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 -mt-1">
                  Mock Test Platform
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  isActive('/') 
                    ? 'text-indigo-600 bg-indigo-50 font-semibold' 
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70'
                }`}
              >
                Home
              </Link>
              <Link
                to="/exams"
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  isActive('/exams') 
                    ? 'text-indigo-600 bg-indigo-50 font-semibold' 
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70'
                }`}
              >
                <span>Exams Catalog</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  NEW
                </span>
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/my-exams"
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      isActive('/my-exams') 
                        ? 'text-indigo-600 bg-indigo-50 font-semibold' 
                        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100/70'
                    }`}
                  >
                    My Tests
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
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
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
                      <p className="text-sm font-semibold leading-none text-slate-900">{user?.name || 'Student Candidate'}</p>
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
                    <span>My Subscriptions</span>
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
            ) : (
              <div className="flex items-center gap-2.5">
                <Button variant="ghost" size="sm" asChild className="text-slate-700 hover:text-indigo-600 font-medium">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium shadow-md shadow-indigo-500/20 transition-all">
                  <Link to="/register" className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Start Free Mock</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Enhanced EdTech Platform Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 pt-12 pb-8 mt-12">
        <div className="container px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="font-extrabold text-lg text-white tracking-tight">AimEducare</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                India's leading competitive exam simulator. Real CBT interface, All-India Rank benchmarking, and topic-wise analytics for serious aspirants.
              </p>
              <div className="flex items-center gap-2 pt-2 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="h-4 w-4" />
                <span>TCS-iON & NTA Pattern Aligned</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Popular Exams</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><Link to="/exams" className="hover:text-indigo-400 transition-colors">Banking & Insurance (SBI, IBPS)</Link></li>
                <li><Link to="/exams" className="hover:text-indigo-400 transition-colors">SSC (CGL, CHSL, MTS, CPO)</Link></li>
                <li><Link to="/exams" className="hover:text-indigo-400 transition-colors">Railways (RRB NTPC, Group D)</Link></li>
                <li><Link to="/exams" className="hover:text-indigo-400 transition-colors">Civil Services & State PSCs</Link></li>
                <li><Link to="/exams" className="hover:text-indigo-400 transition-colors">Teaching & Defence Services</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Mock Features</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2"><Zap className="h-3.5 w-3.5 text-amber-400" /> Full-Length Mock Tests</li>
                <li className="flex items-center gap-2"><Zap className="h-3.5 w-3.5 text-amber-400" /> Real-time Countdown Timer</li>
                <li className="flex items-center gap-2"><Zap className="h-3.5 w-3.5 text-amber-400" /> Instant Percentile & Rank</li>
                <li className="flex items-center gap-2"><Zap className="h-3.5 w-3.5 text-amber-400" /> Anti-Cheat Fullscreen Shield</li>
                <li className="flex items-center gap-2"><Zap className="h-3.5 w-3.5 text-amber-400" /> Step-by-Step Solutions</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Candidate Support</h4>
              <p className="text-xs text-slate-400 mb-2">Have questions about your test series or mock pass?</p>
              <div className="rounded-lg bg-slate-800 p-3 border border-slate-700 text-xs space-y-1">
                <p className="text-slate-300 font-medium">Exam Support Desk</p>
                <p className="text-slate-400">support@aimeducare.com</p>
                <p className="text-[11px] text-emerald-400 font-medium pt-1">Active Monday &ndash; Saturday (9 AM &ndash; 7 PM)</p>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <div>
              &copy; {new Date().getFullYear()} AimEducare Technologies. All rights reserved.
            </div>
            <div className="flex gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Refund Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}