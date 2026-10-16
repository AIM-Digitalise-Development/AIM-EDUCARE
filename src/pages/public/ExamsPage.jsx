import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { examsApi } from '@/api/exams';
import ExamCard from '@/components/exam/ExamCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '@/components/shared/EmptyState';
import { GraduationCap, Layers } from 'lucide-react';

export default function ExamsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategorySlug = searchParams.get('category') || '';

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['exam-categories'],
    queryFn: async () => {
      const res = await examsApi.getCategories();
      return res.data?.data || [];
    },
  });

  const selectedCat = categories?.find((c) => c.slug === currentCategorySlug);

  const { data: exams, isLoading: loadingExams } = useQuery({
    queryKey: ['exams', { category_id: selectedCat?.id, currentCategorySlug }],
    queryFn: async () => {
      const params = {};
      if (selectedCat?.id) params.category_id = selectedCat.id;
      const res = await examsApi.getExams(params);
      return res.data?.data?.items || res.data?.data || [];
    },
  });

  const handleSelectCategory = (slug) => {
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="container px-4 sm:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Competitive Exams Catalog
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Browse comprehensive mock test series organized by exam category
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b">
        <Button
          variant={!currentCategorySlug ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleSelectCategory('')}
          className="rounded-full text-xs"
        >
          All Exams
        </Button>
        {loadingCategories
          ? [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-8 w-24 rounded-full" />)
          : (categories || []).map((cat) => (
              <Button
                key={cat.id}
                variant={currentCategorySlug === cat.slug ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSelectCategory(cat.slug)}
                className="rounded-full text-xs whitespace-nowrap"
              >
                {cat.name}
              </Button>
            ))}
      </div>

      {/* Exam Grid */}
      {loadingExams ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-3 p-6 border rounded-xl">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      ) : !exams || exams.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No exams found"
          description="There are currently no active exams under this category filter."
          action={
            <Button variant="outline" size="sm" onClick={() => handleSelectCategory('')}>
              Reset Filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      )}
    </div>
  );
}