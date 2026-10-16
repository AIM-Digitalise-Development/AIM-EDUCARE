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
} from 'lucide-react';

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
    { label: 'Students', value: metrics.students_count || 0, icon: Users, color: 'text-blue-500' },
    { label: 'Exams', value: metrics.exams_count || 0, icon: GraduationCap, color: 'text-emerald-500' },
    { label: 'Questions', value: metrics.questions_count || 0, icon: HelpCircle, color: 'text-purple-500' },
    { label: 'Mock Tests', value: metrics.tests_count || 0, icon: FileText, color: 'text-indigo-500' },
    { label: 'Attempts', value: metrics.attempts_count || 0, icon: Clock, color: 'text-amber-500' },
    { label: 'Submitted', value: metrics.submitted_attempts_count || 0, icon: CheckCircle2, color: 'text-emerald-600' },
    { label: 'Paid Orders', value: metrics.paid_orders_count || 0, icon: ShoppingBag, color: 'text-rose-500' },
    { label: 'Total Revenue', value: `₹${metrics.total_revenue || 0}`, icon: IndianRupee, color: 'text-primary' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Platform-wide test metrics, user volume, and revenue analytics
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((st, i) => {
          const Icon = st.icon;
          return (
            <Card key={i} className="border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {st.label}
                </CardTitle>
                <Icon className={`h-4 w-4 ${st.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{st.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {recentOrders.length === 0 ? (
              <p className="text-muted-foreground">No recent orders recorded.</p>
            ) : (
              recentOrders.map((ord) => (
                <div key={ord.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <div className="font-semibold text-foreground">Order #{ord.id} — {ord.user?.name || 'Student'}</div>
                    <div className="text-muted-foreground text-[11px]">{ord.plan?.name || 'Mock Plan'}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{ord.amount}</div>
                    <Badge variant="secondary" className="capitalize text-[10px] mt-0.5">
                      {ord.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Test Attempts */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Recent Test Attempts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {recentAttempts.length === 0 ? (
              <p className="text-muted-foreground">No recent attempts recorded.</p>
            ) : (
              recentAttempts.map((att) => (
                <div key={att.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <div className="font-semibold text-foreground">{att.test?.title || 'Mock Test'}</div>
                    <div className="text-muted-foreground text-[11px]">User: {att.user?.name || 'Candidate'}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{att.score !== null ? `${att.score} pts` : '--'}</div>
                    <Badge variant="outline" className="capitalize text-[10px] mt-0.5">
                      {att.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs Overview */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Latest System Audit Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          {recentLogs.length === 0 ? (
            <p className="text-muted-foreground">No audit activities logged.</p>
          ) : (
            recentLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center justify-between py-1.5 border-b last:border-0 text-muted-foreground">
                <span className="font-mono text-xs font-semibold text-foreground">{log.action}</span>
                <span>{log.user?.name || 'System'}</span>
                <span>{log.created_at ? new Date(log.created_at).toLocaleTimeString() : '--'}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}