import { useQuery } from '@tanstack/react-query';
import { adminDashboardApi } from '@/api/admin/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import {
  Users,
  GraduationCap,
  HelpCircle,
  FileText,
  Clock,
  CheckCircle2,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  Award,
  Zap,
  ArrowUpRight,
  FileSpreadsheet
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const res = await adminDashboardApi.getStats();
      return res.data?.data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner text="Loading administrator dashboard..." />;
  }

  const metrics = data?.metrics || {};
  const recentOrders = data?.recent_orders || [];
  const recentAttempts = data?.recent_attempts || [];
  const recentLogs = data?.recent_logs || [];

  const statCards = [
    { 
      label: 'Total Candidates', 
      value: metrics.students_count || 0, 
      icon: Users, 
      bgGradient: 'from-blue-50 to-indigo-50/50',
      iconBg: 'bg-blue-600 text-white shadow-blue-500/20',
      border: 'border-blue-200/80',
      badge: 'Registered Students',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    { 
      label: 'Exam Streams', 
      value: metrics.exams_count || 0, 
      icon: GraduationCap, 
      bgGradient: 'from-emerald-50 to-teal-50/50',
      iconBg: 'bg-emerald-600 text-white shadow-emerald-500/20',
      border: 'border-emerald-200/80',
      badge: 'Active Catalogs',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    { 
      label: 'Question Bank', 
      value: metrics.questions_count || 0, 
      icon: HelpCircle, 
      bgGradient: 'from-purple-50 to-violet-50/50',
      iconBg: 'bg-purple-600 text-white shadow-purple-500/20',
      border: 'border-purple-200/80',
      badge: 'Curated Items',
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    { 
      label: 'Mock Test Series', 
      value: metrics.tests_count || 0, 
      icon: FileText, 
      bgGradient: 'from-indigo-50 to-sky-50/50',
      iconBg: 'bg-indigo-600 text-white shadow-indigo-500/20',
      border: 'border-indigo-200/80',
      badge: 'CBT Papers Live',
      badgeColor: 'bg-indigo-100 text-indigo-800'
    },
    { 
      label: 'Active Attempts', 
      value: metrics.attempts_count || 0, 
      icon: Clock, 
      bgGradient: 'from-amber-50 to-orange-50/50',
      iconBg: 'bg-amber-600 text-white shadow-amber-500/20',
      border: 'border-amber-200/80',
      badge: 'Ongoing Sessions',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    { 
      label: 'Tests Evaluated', 
      value: metrics.submitted_attempts_count || 0, 
      icon: CheckCircle2, 
      bgGradient: 'from-teal-50 to-emerald-50/50',
      iconBg: 'bg-teal-600 text-white shadow-teal-500/20',
      border: 'border-teal-200/80',
      badge: 'Auto Scored & Ranked',
      badgeColor: 'bg-teal-100 text-teal-800'
    },
    { 
      label: 'Paid Orders', 
      value: metrics.paid_orders_count || 0, 
      icon: ShoppingBag, 
      bgGradient: 'from-rose-50 to-pink-50/50',
      iconBg: 'bg-rose-600 text-white shadow-rose-500/20',
      border: 'border-rose-200/80',
      badge: 'Subscriptions',
      badgeColor: 'bg-rose-100 text-rose-800'
    },
    { 
      label: 'Gross Revenue', 
      value: `₹${metrics.total_revenue || 0}`, 
      icon: IndianRupee, 
      bgGradient: 'from-amber-500 to-orange-600 text-white',
      iconBg: 'bg-white/20 text-white shadow-orange-500/30',
      border: 'border-amber-500',
      badge: 'Direct Gateway',
      badgeColor: 'bg-white/20 text-white font-bold',
      isHero: true
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Platform Command Center
          </h1>
          <p className="text-slate-500 mt-1 text-xs sm:text-sm">
            Real-time candidate volumes, mock test operations, and revenue analytics
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/tests"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all"
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Create Test</span>
          </Link>
          <Link
            to="/admin/questions"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-xs transition-all"
          >
            <HelpCircle className="h-3.5 w-3.5 text-indigo-600" />
            <span>Add Question</span>
          </Link>
        </div>
      </div>

      {/* Modern 8 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((st, i) => {
          const Icon = st.icon;
          return (
            <Card 
              key={i} 
              className={`border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                st.isHero 
                  ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-transparent shadow-lg shadow-orange-500/20' 
                  : `bg-gradient-to-br ${st.bgGradient} ${st.border}`
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${st.isHero ? 'text-amber-100' : 'text-slate-500'}`}>
                  {st.label}
                </span>
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shadow-sm ${st.iconBg}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between gap-2">
                  <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${st.isHero ? 'text-white' : 'text-slate-900'}`}>
                    {st.value}
                  </div>
                </div>
                <div className="mt-2.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${st.badgeColor}`}>
                    {st.badge}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Card */}
        <Card className="border border-slate-200/80 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-rose-500" />
                <span>Recent Subscriptions & Orders</span>
              </CardTitle>
            </div>
            <Link to="/admin/orders" className="text-xs text-indigo-600 hover:underline font-semibold flex items-center">
              View All <ArrowUpRight className="h-3 w-3 ml-0.5" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3 pt-3 text-xs">
            {recentOrders.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <ShoppingBag className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p>No orders recorded yet.</p>
              </div>
            ) : (
              recentOrders.map((ord) => (
                <div key={ord.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {ord.user?.name ? ord.user.name[0].toUpperCase() : 'S'}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {ord.user?.name || 'Student Candidate'}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        {ord.plan?.name || 'Mock Test Pass'} &bull; Order #{ord.id}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">₹{ord.amount}</div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${
                      ord.status === 'completed' || ord.status === 'paid' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Test Attempts Card */}
        <Card className="border border-slate-200/80 shadow-xs bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-600" />
                <span>Live Test Attempt Sessions</span>
              </CardTitle>
            </div>
            <Link to="/admin/tests" className="text-xs text-indigo-600 hover:underline font-semibold flex items-center">
              Manage Tests <ArrowUpRight className="h-3 w-3 ml-0.5" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3 pt-3 text-xs">
            {recentAttempts.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p>No test attempts recorded yet.</p>
              </div>
            ) : (
              recentAttempts.map((att) => (
                <div key={att.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                      <Award className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {att.test?.title || 'Competitive Mock Test'}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        Candidate: {att.user?.name || 'Aspirant'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">
                      {att.score !== null ? `${att.score} pts` : '--'}
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${
                      att.status === 'completed' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {att.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs Overview */}
      <Card className="border border-slate-200/80 shadow-xs bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-purple-600" />
              <span>Security & Audit Trails</span>
            </CardTitle>
          </div>
          <Link to="/admin/audit-logs" className="text-xs text-indigo-600 hover:underline font-semibold flex items-center">
            Full Audit Log &rarr;
          </Link>
        </CardHeader>
        <CardContent className="pt-3">
          {recentLogs.length === 0 ? (
            <p className="text-slate-400 text-xs py-4 text-center">No system audit activities logged.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center justify-between py-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-indigo-700">
                      {log.action}
                    </span>
                    <span className="text-slate-600">{log.entity || 'Resource'} #{log.entity_id || ''}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                    <span className="font-medium text-slate-600">{log.user?.name || 'Administrator'}</span>
                    <span>{log.created_at ? new Date(log.created_at).toLocaleTimeString() : '--'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}