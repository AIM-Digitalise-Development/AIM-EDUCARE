import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { examsApi } from '@/api/exams';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/shared/EmptyState';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { GraduationCap, ArrowRight, BookOpen } from 'lucide-react';

export default function MyExamsPage() {
  const { data: exams, isLoading } = useQuery({
    queryKey: ['my-exams'],
    queryFn: async () => {
      const res = await examsApi.getMyExams();
      return res.data?.data || [];
    },
  });

  if (isLoading) {
    return <LoadingSpinner text="Loading your enrolled exams..." />;
  }

  return (
    <div className="container px-4 sm:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Enrolled Exams</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Access mock tests and track your progress across enrolled competitive exams
        </p>
      </div>

      {!exams || exams.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No active exam plans"
          description="You haven't enrolled in any exam mock test plans yet. Browse all exams to choose a test package."
          action={
            <Button asChild>
              <Link to="/exams">Browse All Exams</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <Card key={exam.id} className="flex flex-col justify-between hover:shadow-md border">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  {exam.category?.name && (
                    <Badge variant="outline" className="text-xs">
                      {exam.category.name}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs text-emerald-600 bg-emerald-500/10">
                    Active Plan
                  </Badge>
                </div>
                <CardTitle className="text-xl">{exam.name}</CardTitle>
                <CardDescription className="line-clamp-2 text-sm mt-1">
                  {exam.description || 'Full length online mock test series for competitive examination.'}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-2">
                <Button asChild className="w-full gap-2">
                  <Link to={`/my-exams/${exam.slug}`}>
                    <BookOpen className="h-4 w-4" />
                    View Tests
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}