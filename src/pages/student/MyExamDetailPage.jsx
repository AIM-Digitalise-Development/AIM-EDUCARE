import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { examsApi } from '@/api/exams';
import { testsApi } from '@/api/tests';
import TestCard from '@/components/exam/TestCard';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/shared/EmptyState';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { ArrowLeft, Layers } from 'lucide-react';
import { toast } from 'sonner';

export default function MyExamDetailPage() {
  const { slug } = useParams();
  const [startingId, setStartingId] = useState(null);

  const { data: tests, isLoading } = useQuery({
    queryKey: ['my-exam-tests', slug],
    queryFn: async () => {
      const res = await examsApi.getMyExamTests(slug);
      return res.data?.data || [];
    },
  });

  const handleStartTest = async (test) => {
    setStartingId(test.id);
    try {
      const res = await testsApi.startTest(test.id);
      if (res.data?.success) {
        const payload = res.data.data;
        const attemptId = payload.attempt_id;
        sessionStorage.setItem(`aimeducare-attempt-payload-${attemptId}`, JSON.stringify(payload));
        sessionStorage.setItem(`aimeducare-attempt-exam-slug-${attemptId}`, slug);
        window.open(`/attempt/${attemptId}`, '_blank');
      } else {
        toast.error(res.data?.message || 'Failed to start test.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error starting test session.');
    } finally {
      setStartingId(null);
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading mock tests..." />;
  }

  return (
    <div className="container px-4 sm:px-8 py-10 space-y-8">
      <div>
        <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs text-muted-foreground mb-4">
          <Link to="/my-exams">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to My Exams
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-foreground capitalize">
          {slug?.replace('-', ' ')} Tests
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Select a mock test to launch real exam simulation with timed sections and auto-scoring
        </p>
      </div>

      {!tests || tests.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No tests available"
          description="There are no published mock tests available for this exam yet."
          action={
            <Button asChild variant="outline">
              <Link to="/my-exams">Back to My Exams</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <TestCard
              key={test.id}
              test={test}
              onStart={handleStartTest}
              loading={startingId === test.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}