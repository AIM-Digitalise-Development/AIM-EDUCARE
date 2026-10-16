import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicExamsApi } from '@/api/exams';
import ExamCard from '@/components/exam/ExamCard';
import EmptyState from '@/components/shared/EmptyState';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, GraduationCap, X, Layers, Sparkles, Filter } from 'lucide-react';
import { useState } from 'react';

export default function ExamsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || '';
  const [searchTerm, setSearchTerm] = useState('');

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['exam-categories'],
    queryFn: async () => {
      const res = await publicExamsApi.getCategories();
      return res.data?.data || [];
    },
  });

  const { data: examsData, isLoading: loadingExams } = useQuery({
    queryKey: ['exams', { category: selectedCategory }],
    queryFn: async () => {
      const res = await publicExamsApi.getExams({ category: selectedCategory });
      return res.data?.data?.items || res.data?.data || [];
    },
  });

  const handleCategoryChange = (slug) => {
    if (!slug) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const filteredExams = (examsData || []).filter((exam) => {
    if (!searchTerm.trim()) return true;
    return (
      exam.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="container px-4 sm:px-8 py-10 max-w-7xl mx-auto space-y-8">
      {/* Catalog Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white p-6 sm:p-10 relative overflow-hidden shadow-lg border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        
        <div className="max-w-2xl relative z-10">
          <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5 mr-1 text-amber-400" />
            2026 Test Series & Previous Papers
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Explore All Exam Test Series
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Choose your target competitive exam stream below to start practicing full-length mock tests designed by exam toppers.
          </p>

          {/* Search bar inside banner */}
          <div className="relative mt-6 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search exam e.g. SBI PO, SSC CGL, RRB NTPC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 h-11 bg-white/10 border-slate-700 text-white placeholder:text-slate-400 backdrop-blur-sm focus:bg-white focus:text-slate-900 rounded-xl transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter Chips Bar */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
          <Filter className="h-3.5 w-3.5 text-indigo-600" />
          <span>Filter by Exam Stream</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              !selectedCategory
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/25'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            All Exams ({examsData?.length || 0})
          </button>
          {(categories || []).map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat.slug
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/25'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Exams Grid */}
      {loadingExams ? (
        <LoadingSpinner text="Loading competitive exam test series..." />
      ) : filteredExams.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No exam test series found"
          description={
            searchTerm
              ? `No tests match "${searchTerm}". Try another search term or clear the filter.`
              : 'No mock exams are active in this stream yet.'
          }
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                handleCategoryChange('');
              }}
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      )}
    </div>
  );
}