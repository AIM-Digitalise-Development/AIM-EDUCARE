import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Award, ShieldCheck, Sparkles } from 'lucide-react';

export default function ExamCard({ exam }) {
  return (
    <Card className="flex flex-col justify-between hover:shadow-xl transition-all duration-200 border border-slate-200/80 bg-white hover:border-indigo-400 group overflow-hidden relative">
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 opacity-80 group-hover:opacity-100 transition-opacity" />

      <CardHeader className="pb-3 pt-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          {exam.category?.name ? (
            <Badge variant="outline" className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 border-indigo-200">
              {exam.category.name}
            </Badge>
          ) : (
            <div />
          )}
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Free Mock
          </span>
        </div>

        <div className="flex items-start gap-3 mt-1">
          {exam.logo_url && (
            <img
              src={exam.logo_url}
              alt={exam.name}
              className="h-9 w-9 object-contain rounded-lg border border-slate-100 p-0.5 shrink-0 bg-white shadow-xs"
            />
          )}
          <div>
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
              {exam.name}
            </CardTitle>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-0.5">
              TCS-iON CBT Interface
            </p>
          </div>
        </div>

        <CardDescription className="line-clamp-2 text-xs text-slate-500 mt-2.5">
          {exam.description || 'Full length online mock test series for competitive examination preparation.'}
        </CardDescription>

        <div className="pt-3 flex items-center gap-3 text-[11px] text-slate-500 border-t border-slate-100 mt-3">
          <span className="flex items-center gap-1 font-medium">
            <Clock className="h-3 w-3 text-indigo-500" />
            Timed Mocks
          </span>
          <span>&bull;</span>
          <span className="flex items-center gap-1 font-medium">
            <Award className="h-3 w-3 text-amber-500" />
            AIR Leaderboard
          </span>
        </div>
      </CardHeader>

      <CardFooter className="pt-2 bg-slate-50/50 border-t border-slate-100 mt-2">
        <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm group-hover:shadow-md transition-all">
          <Link to={`/exams/${exam.slug}`} className="flex items-center justify-center gap-1.5">
            <span>Explore Test Series</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}