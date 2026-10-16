import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen, Layers, Award, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function HomePage() {
  const {
    data: categories,
    isLoading: loadingCategories,
    error: categoriesError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ['public-exam-categories'],
    queryFn: async () => {
      const res = await api.get('/api/exam-categories');
      return res.data?.data || [];
    },
  });

  const {
    data: exams,
    isLoading: loadingExams,
    error: examsError,
    refetch: refetchExams,
  } = useQuery({
    queryKey: ['public-exams'],
    queryFn: async () => {
      const res = await api.get('/api/exams');
      return res.data?.data?.items || res.data?.data || [];
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-muted/50 via-background to-background py-20 md:py-28">
        <div className="container px-4 sm:px-8 text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs font-semibold gap-1.5 inline-flex items-center">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Next-Gen Competitive Exam Preparation</span>
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            AimEducare — Mock Tests for Every Exam
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Real exam simulation, detailed percentile analytics, timed sectional tests, and high-yield questions curated by top rankers.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild className="h-12 px-8 text-base shadow-md">
              <Link to="/exams">
                Explore All Exams
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base">
              <Link to="/register">Create Free Account</Link>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t text-left max-w-2xl mx-auto">
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Full-length Mock Tests</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Instant All-India Rank</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Anti-Cheat Real Environment</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/20">
        <div className="container px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-1">
                <Layers className="h-4 w-4" />
                <span>EXAM CATEGORIES</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Popular Test Categories</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Choose your target competitive exam stream
              </p>
            </div>
            <Button variant="ghost" asChild className="mt-4 md:mt-0">
              <Link to="/exams" className="text-sm font-medium">
                View all categories <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loadingCategories ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </Card>
              ))}
            </div>
          ) : categoriesError ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center max-w-md mx-auto">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-3" />
              <p className="text-sm text-destructive font-medium mb-3">Failed to load exam categories.</p>
              <Button size="sm" variant="outline" onClick={() => refetchCategories()}>
                Try Again
              </Button>
            </div>
          ) : !categories || categories.length === 0 ? (
            <div className="text-center py-12 border rounded-xl bg-card">
              <Layers className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">No categories available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/exams?category=${cat.slug}`}
                  className="group block transition-transform hover:-translate-y-1 duration-200"
                >
                  <Card className="h-full border hover:border-primary/50 hover:shadow-md transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {cat.name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Comprehensive mock test series & practice papers
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-0 text-xs font-medium text-primary flex items-center">
                      <span>Browse category</span>
                      <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Exams Section */}
      <section className="py-16">
        <div className="container px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-1">
                <Award className="h-4 w-4" />
                <span>EXAM SERIES</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Available Mock Test Packages</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Simulate real exam conditions with full-length mocks
              </p>
            </div>
            <Button variant="ghost" asChild className="mt-4 md:mt-0">
              <Link to="/exams" className="text-sm font-medium">
                View all exams <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loadingExams ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="space-y-4 p-6">
                  <Skeleton className="h-5 w-1/3 mb-2" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-9 w-full" />
                </Card>
              ))}
            </div>
          ) : examsError ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center max-w-md mx-auto">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-3" />
              <p className="text-sm text-destructive font-medium mb-3">Failed to load exams.</p>
              <Button size="sm" variant="outline" onClick={() => refetchExams()}>
                Try Again
              </Button>
            </div>
          ) : !exams || exams.length === 0 ? (
            <div className="text-center py-12 border rounded-xl bg-card">
              <Award className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">No active exams listed yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam) => (
                <Card key={exam.id} className="flex flex-col justify-between hover:shadow-lg transition-shadow border">
                  <CardHeader>
                    {exam.category?.name && (
                      <Badge variant="outline" className="w-fit text-xs font-normal mb-2">
                        {exam.category.name}
                      </Badge>
                    )}
                    <CardTitle className="text-xl">{exam.name}</CardTitle>
                    <CardDescription className="line-clamp-2 text-sm mt-1">
                      {exam.description || 'Full length online mock test series for competitive examination preparation.'}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2">
                    <Button asChild className="w-full">
                      <Link to={`/exams/${exam.slug}`}>
                        View Exam
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}