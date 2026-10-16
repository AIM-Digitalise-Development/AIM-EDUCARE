import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicExamsApi } from '@/api/exams';
import { useAuthStore } from '@/stores/authStore';
import { useRazorpay } from '@/hooks/useRazorpay';
import PlanCard from '@/components/exam/PlanCard';
import TestCard from '@/components/exam/TestCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Zap, 
  Clock, 
  Award, 
  FileText,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function ExamDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)();
  const { purchasePlan, loading: purchasing } = useRazorpay();

  const { data: exam, isLoading: loadingExam } = useQuery({
    queryKey: ['exam-detail', slug],
    queryFn: async () => {
      const res = await publicExamsApi.getExamDetail(slug);
      return res.data?.data;
    },
  });

  const { data: plans = [], isLoading: loadingPlans } = useQuery({
    queryKey: ['exam-plans', slug],
    queryFn: async () => {
      const res = await publicExamsApi.getExamPlans(slug);
      return res.data?.data || [];
    },
  });

  const { data: tests = [], isLoading: loadingTests } = useQuery({
    queryKey: ['exam-tests', slug],
    queryFn: async () => {
      const res = await publicExamsApi.getExamPublicTests(slug);
      return res.data?.data || [];
    },
  });

  const freeTest = tests.find((t) => t.is_free);

  const handleBuyPlan = async (plan) => {
    if (!isAuthenticated) {
      toast.info('Please sign in to unlock mock test passes.');
      navigate('/login', { state: { from: `/exams/${slug}` } });
      return;
    }

    try {
      await purchasePlan(plan.id, exam.id);
      setTimeout(() => {
        navigate(`/my-exams/${slug}`);
      }, 3000);
    } catch (err) {
      // Handled in useRazorpay
    }
  };

  const handleStartTest = (test) => {
    if (!isAuthenticated) {
      toast.info('Please sign in to attempt mock tests.');
      navigate('/login', { state: { from: `/exams/${slug}` } });
      return;
    }
    navigate(`/my-exams/${slug}`);
  };

  if (loadingExam) {
    return <LoadingSpinner text="Loading exam syllabus & mock test packages..." />;
  }

  if (!exam) {
    return (
      <div className="container py-12 text-center">
        <EmptyState
          title="Exam Not Found"
          description="The requested examination test series does not exist or has been archived."
          action={
            <Button asChild>
              <Link to="/exams">Back to Exams Catalog</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/40 pb-16">
      {/* Top Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200/80 py-3">
        <div className="container px-4 sm:px-8 max-w-7xl mx-auto flex items-center gap-2 text-xs">
          <Link to="/exams" className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-medium">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Exams</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-semibold">{exam.name}</span>
        </div>
      </div>

      {/* Exam Header Hero Card */}
      <section className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white py-12 border-b border-slate-800">
        <div className="container px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                {exam.category?.name && (
                  <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                    {exam.category.name}
                  </Badge>
                )}
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  2026 Updated Pattern
                </span>
              </div>

              <div className="flex items-center gap-4">
                {exam.logo_url && (
                  <img
                    src={exam.logo_url}
                    alt={exam.name}
                    className="h-14 w-14 object-contain rounded-xl bg-white p-1.5 shadow-md shrink-0"
                  />
                )}
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                  {exam.name} Mock Test Series
                </h1>
              </div>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                {exam.description || 'Practice full-length mock tests, sectional papers, and chapter tests with real CBT simulation and All-India Rank.'}
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700/60 p-4 text-xs space-y-2 shrink-0 md:w-64">
              <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Test Series Overview</div>
              <div className="flex items-center justify-between text-slate-200">
                <span>Available Tests:</span>
                <strong className="text-white font-bold">{tests.length} Papers</strong>
              </div>
              <div className="flex items-center justify-between text-slate-200">
                <span>Passes Starting:</span>
                <strong className="text-amber-400 font-bold">₹{plans[0]?.price || '99'}</strong>
              </div>
              <div className="flex items-center justify-between text-slate-200">
                <span>Format:</span>
                <strong className="text-emerald-400 font-bold">TCS-iON CBT</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container px-4 sm:px-8 max-w-7xl mx-auto mt-8 space-y-12">
        {/* Free Mock Test Banner (If available) */}
        {freeTest && (
          <div className="rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/30 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm bg-white">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  FREE DEMO MOCK
                </span>
                <h3 className="font-bold text-slate-900 text-base">{freeTest.title}</h3>
              </div>
              <p className="text-xs text-slate-600">
                Experience the real test environment, countdown timer, and negative marking with zero cost.
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => handleStartTest(freeTest)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 shrink-0"
            >
              <Zap className="mr-1.5 h-4 w-4 fill-current" />
              Start Free Mock Now
            </Button>
          </div>
        )}

        {/* Subscription Plans Section */}
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold tracking-wider uppercase mb-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Subscription Passes</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Unlock Full Mock Test Series
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Get complete access to all full-length mocks, previous year questions, and in-depth analytics.
            </p>
          </div>

          {loadingPlans ? (
            <LoadingSpinner text="Loading subscription plans..." />
          ) : plans.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-slate-200 bg-white">
              <Layers className="h-8 w-8 text-slate-400 mx-auto mb-2 opacity-50" />
              <p className="text-xs text-slate-500">No subscription plans configured for this exam yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onBuy={handleBuyPlan}
                  loading={purchasing}
                />
              ))}
            </div>
          )}
        </div>

        {/* Available Tests List Section */}
        <div>
          <div className="mb-6">
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold tracking-wider uppercase mb-1">
              <FileText className="h-3.5 w-3.5 text-indigo-600" />
              <span>Full Test Syllabus</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Included Mock Papers ({tests.length})
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Full-length mock tests, sectional papers, and previous year examination papers.
            </p>
          </div>

          {loadingTests ? (
            <LoadingSpinner text="Loading test series..." />
          ) : tests.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-slate-200 bg-white">
              <FileText className="h-8 w-8 text-slate-400 mx-auto mb-2 opacity-50" />
              <p className="text-xs text-slate-500">Mock test papers are being scheduled for this series.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {tests.map((test) => (
                <TestCard
                  key={test.id}
                  test={test}
                  onStart={handleStartTest}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}