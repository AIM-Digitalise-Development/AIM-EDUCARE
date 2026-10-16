import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  BookOpen, 
  Layers, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  Zap,
  Target,
  BarChart3,
  Landmark,
  Shield,
  Activity,
  Flame,
  Compass,
  FileCheck
} from 'lucide-react';

const categoryMeta = {
  'banking-insurance': {
    gradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
    border: 'hover:border-blue-500/60',
    iconBg: 'bg-blue-600 text-white shadow-blue-500/30',
    badge: 'SBI, IBPS, RBI',
    icon: Landmark
  },
  'ssc': {
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    border: 'hover:border-emerald-500/60',
    iconBg: 'bg-emerald-600 text-white shadow-emerald-500/30',
    badge: 'CGL, CHSL, MTS, CPO',
    icon: Shield
  },
  'railways': {
    gradient: 'from-purple-500/10 via-violet-500/5 to-transparent',
    border: 'hover:border-purple-500/60',
    iconBg: 'bg-purple-600 text-white shadow-purple-500/30',
    badge: 'RRB NTPC, Group D, ALP',
    icon: Activity
  },
  'civil-services-state-pscs': {
    gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
    border: 'hover:border-amber-500/60',
    iconBg: 'bg-amber-600 text-white shadow-amber-500/30',
    badge: 'UPSC CSE, State PSC',
    icon: Award
  },
  'defence-police': {
    gradient: 'from-rose-500/10 via-red-500/5 to-transparent',
    border: 'hover:border-rose-500/60',
    iconBg: 'bg-rose-600 text-white shadow-rose-500/30',
    badge: 'NDA, CDS, AFCAT, Police',
    icon: Flame
  },
  'engineering-medical-entrance': {
    gradient: 'from-cyan-500/10 via-sky-500/5 to-transparent',
    border: 'hover:border-cyan-500/60',
    iconBg: 'bg-cyan-600 text-white shadow-cyan-500/30',
    badge: 'JEE Main, NEET UG',
    icon: Compass
  },
};

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
    <div className="flex flex-col min-h-screen bg-slate-50/40">
      {/* High-Impact Exam Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900 text-white py-16 md:py-24">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e510_1px,transparent_1px),linear-gradient(to_bottom,#4f46e510_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
        
        {/* Glowing radial blur */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-500/20 blur-[100px] pointer-events-none rounded-full" />

        <div className="container px-4 sm:px-8 text-center max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-6 shadow-inner backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Real TCS-iON & NTA Pattern CBT Mock Tests &bull; 2026 Syllabus</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] text-white">
            Simulate Real Exam Conditions. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Score Higher & Rank Top.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Practice on India's most authentic CBT simulator. Get exact question palettes, sectional timers, instant All-India Rank, and AI-powered performance analysis.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild className="h-12 px-8 text-sm sm:text-base font-bold bg-gradient-to-r from-indigo-500 via-indigo-600 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-xl shadow-indigo-600/30 border-0 transition-all hover:scale-[1.02]">
              <Link to="/exams">
                <Zap className="mr-2 h-4 w-4 text-amber-300 fill-amber-300" />
                Start Free Mock Test
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8 text-sm sm:text-base font-semibold border-slate-700 text-slate-200 bg-slate-800/60 hover:bg-slate-800 hover:text-white transition-all">
              <Link to="/exams">Browse 100+ Exams</Link>
            </Button>
          </div>

          {/* Exam Simulator Feature Pills */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 border-t border-slate-800/80 text-left max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50">
              <Clock className="h-4 w-4 text-amber-400 shrink-0" />
              <span>Sectional Timers</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50">
              <BarChart3 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Instant All-India Rank</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50">
              <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0" />
              <span>Anti-Cheat Fullscreen</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/50">
              <FileCheck className="h-4 w-4 text-purple-400 shrink-0" />
              <span>Step-by-Step Solutions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Metric Counters Banner */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="container px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">50,000+</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">High-Yield Questions</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">100+</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Full Mock Test Series</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-600">99.4%</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Exam Pattern Match</div>
            </div>
            <div className="pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">Instant</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Scorecard & Percentile</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold tracking-wider uppercase mb-1">
                <Layers className="h-3.5 w-3.5" />
                <span>Target Exam Streams</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Popular Competitive Test Categories
              </h2>
              <p className="text-slate-500 mt-1 text-xs sm:text-sm">
                Choose your dream exam and access comprehensive test series with free trial mocks
              </p>
            </div>
            <Button variant="ghost" asChild className="mt-4 md:mt-0 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold text-xs sm:text-sm">
              <Link to="/exams" className="flex items-center gap-1">
                <span>View all exam streams</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loadingCategories ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-6 space-y-4 border border-slate-200">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
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
            <div className="text-center py-12 border rounded-xl bg-white shadow-xs">
              <Layers className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">No categories available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {categories.map((cat) => {
                const meta = categoryMeta[cat.slug] || {
                  gradient: 'from-indigo-500/10 via-blue-500/5 to-transparent',
                  border: 'hover:border-indigo-500/60',
                  iconBg: 'bg-indigo-600 text-white shadow-indigo-500/30',
                  badge: 'Competitive Mocks',
                  icon: BookOpen
                };
                const IconComponent = meta.icon;

                return (
                  <Link
                    key={cat.id}
                    to={`/exams?category=${cat.slug}`}
                    className="group block transition-all duration-200 hover:-translate-y-1"
                  >
                    <Card className={`h-full border border-slate-200/80 bg-white hover:shadow-xl transition-all relative overflow-hidden ${meta.border}`}>
                      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${meta.iconBg}`} />
                      
                      <CardHeader className="pb-3 pt-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-md ${meta.iconBg} group-hover:scale-110 transition-transform duration-200`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                            CBT Mocks
                          </span>
                        </div>
                        <CardTitle className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {cat.name}
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 line-clamp-2">
                          {meta.badge} &bull; Full mocks, sectional papers, and chapter practice
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="pt-0 text-xs font-bold text-indigo-600 flex items-center justify-between border-t border-slate-100 mt-2 py-3 bg-slate-50/50">
                        <span>Explore test series</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </CardFooter>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Featured Exams Section */}
      <section className="py-16 bg-slate-100/60 border-y border-slate-200/80">
        <div className="container px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold tracking-wider uppercase mb-1">
                <Award className="h-3.5 w-3.5" />
                <span>Curated Test Packages</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Featured Mock Test Series
              </h2>
              <p className="text-slate-500 mt-1 text-xs sm:text-sm">
                Complete mock test series aligned with latest pattern and negative marking
              </p>
            </div>
            <Button variant="ghost" asChild className="mt-4 md:mt-0 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-semibold text-xs sm:text-sm">
              <Link to="/exams" className="flex items-center gap-1">
                <span>View all exam packages</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loadingExams ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 space-y-4 border border-slate-200 bg-white">
                  <Skeleton className="h-5 w-1/3 mb-2" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-10 w-full" />
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
            <div className="text-center py-12 border rounded-xl bg-white shadow-xs">
              <Award className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">No active exams listed yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.slice(0, 6).map((exam) => (
                <Card key={exam.id} className="flex flex-col justify-between hover:shadow-xl transition-all border border-slate-200/80 bg-white group hover:border-indigo-400">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      {exam.category?.name && (
                        <Badge variant="outline" className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 border-indigo-200">
                          {exam.category.name}
                        </Badge>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Free Mock Included
                      </span>
                    </div>

                    <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {exam.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-xs text-slate-500 mt-1">
                      {exam.description || 'Full length online mock test series for competitive examination preparation.'}
                    </CardDescription>

                    <div className="pt-3 flex items-center gap-3 text-[11px] text-slate-500 border-t border-slate-100 mt-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-indigo-600" />
                        Timed Tests
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Award className="h-3 w-3 text-amber-600" />
                        AIR Benchmark
                      </span>
                    </div>
                  </CardHeader>

                  <CardFooter className="pt-2">
                    <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm">
                      <Link to={`/exams/${exam.slug}`} className="flex items-center justify-center gap-1.5">
                        <span>View Test Series</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why AimEducare (CBT Simulation Advantages) Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-2 bg-indigo-50 text-indigo-700 border-indigo-200 text-xs font-bold uppercase tracking-wider">
              Real Exam Feel
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Aspirants Choose AimEducare
            </h2>
            <p className="text-slate-500 mt-2 text-xs sm:text-sm">
              We replicate the exact stress, timing, and interface of actual competitive exams.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-md shadow-blue-500/20">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">TCS-iON CBT Engine</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Exact question palette colors, section lock-in, and countdown timer just like the real examination hall.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-md shadow-emerald-500/20">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">All-India Percentile</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Benchmark your performance against thousands of serious candidates with accurate projected cutoffs.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all">
              <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4 shadow-md shadow-purple-500/20">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">Speed & Accuracy Matrix</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Identify topics where you waste time or lose marks due to negative marking to eliminate silly mistakes.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all">
              <div className="h-10 w-10 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-4 shadow-md shadow-amber-500/20">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">Detailed Solutions</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every question comes with step-by-step methods, shortcut formulas, and topper notes for rapid revision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Banner */}
      <section className="py-12 bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white">
        <div className="container px-4 sm:px-8 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to Test Your Real Preparation Level?
          </h2>
          <p className="text-indigo-200 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
            Join thousands of candidates who improved their speed and accuracy by practicing real mock tests.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button size="lg" asChild className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-400/20 border-0">
              <Link to="/exams">Take a Free Mock Test Now &rarr;</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}