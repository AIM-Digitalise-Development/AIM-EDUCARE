import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { examsApi } from '@/api/exams';
import { testsApi } from '@/api/tests';
import { useAuthStore } from '@/stores/authStore';
import { useRazorpay } from '@/hooks/useRazorpay';
import PlanCard from '@/components/exam/PlanCard';
import TestCard from '@/components/exam/TestCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { ArrowLeft, Sparkles, CheckCircle, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

export default function ExamDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)();
  const { pay } = useRazorpay();

  const { data: exam, isLoading: loadingExam } = useQuery({
    queryKey: ['exam-detail', slug],
    queryFn: async () => {
      const res = await examsApi.getExamDetail(slug);
      return res.data?.data;
    },
  });

  const { data: plans, isLoading: loadingPlans } = useQuery({
    queryKey: ['exam-plans', slug],
    queryFn: async () => {
      const res = await examsApi.getExamPlans(slug);
      return res.data?.data || [];
    },
  });

  const { data: publicTests, isLoading: loadingTests } = useQuery({
    queryKey: ['exam-public-tests', slug],
    queryFn: async () => {
      const res = await examsApi.getExamPublicTests(slug);
      return res.data?.data || [];
    },
  });

  const handleBuyPlan = async (plan) => {
    if (!isAuthenticated) {
      toast.info('Please log in or register to purchase a mock test plan.');
      navigate('/login', { state: { from: `/exams/${slug}` } });
      return;
    }

    await pay({
      planId: plan.id,
      examId: exam?.id,
      onSuccess: () => {
        toast.success('Payment verified! Redirecting to your enrolled exams...');
        setTimeout(() => {
          navigate(`/my-exams/${slug}`);
        }, 1500);
      },
    });
  };

  const handleStartFreeMock = async (test) => {
    if (!isAuthenticated) {
      toast.info('Please log in to start this test.');
      navigate('/login', { state: { from: `/exams/${slug}` } });
      return;
    }

    try {
      const res = await testsApi.startTest(test.id);
      if (res.data?.success) {
        const payload = res.data.data;
        const attemptId = payload.attempt_id;
        sessionStorage.setItem(`aimeducare-attempt-payload-${attemptId}`, JSON.stringify(payload));
        sessionStorage.setItem(`aimeducare-attempt-exam-slug-${attemptId}`, slug);
        window.open(`/attempt/${attemptId}`, '_blank');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not start test.');
    }
  };

  if (loadingExam) {
    return <LoadingSpinner text="Loading exam details..." />;
  }

  if (!exam) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-xl font-bold">Exam not found</h2>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/exams">Back to Exams</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container px-4 sm:px-8 py-10 space-y-12">
      {/* Back button */}
      <div>
        <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs text-muted-foreground">
          <Link to="/exams">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to All Exams
          </Link>
        </Button>
      </div>

      {/* Hero Banner */}
      <div className="rounded-2xl border bg-card p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            {exam.category?.name && (
              <Badge variant="secondary" className="text-xs">
                {exam.category.name}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-500/30">
              Active Test Series
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {exam.name}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            {exam.description ||
              'Comprehensive full-length mock tests, detailed percentile breakdown, and section-wise analytics designed for real exam simulation.'}
          </p>
        </div>
      </div>

      {/* Free Mock Tests Section (if available) */}
      {publicTests && publicTests.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h2 className="text-2xl font-bold tracking-tight">Free Preview Tests</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Try free preview mocks before purchasing full packages.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {publicTests.map((test) => (
              <TestCard
                key={test.id}
                test={test}
                onStart={() => handleStartFreeMock(test)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Plans Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mock Test Subscription Plans</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a mock pack tailored to your target exam timeline
          </p>
        </div>

        {loadingPlans ? (
          <LoadingSpinner text="Loading plans..." />
        ) : !plans || plans.length === 0 ? (
          <div className="p-8 border rounded-xl text-center text-sm text-muted-foreground">
            No plans available for this exam yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onBuy={handleBuyPlan} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}