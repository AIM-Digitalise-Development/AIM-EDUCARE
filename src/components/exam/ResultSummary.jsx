import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Award, CheckCircle2, XCircle, MinusCircle, Clock, TrendingUp, Target } from 'lucide-react';

export default function ResultSummary({ result }) {
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  const totalAttempted = (result.correct_count || 0) + (result.wrong_count || 0);
  const accuracy = totalAttempted > 0 
    ? Math.round(((result.correct_count || 0) / totalAttempted) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
      {/* Score Tile */}
      <Card className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 text-white shadow-lg shadow-indigo-600/20 border-0">
        <CardHeader className="pb-1">
          <CardTitle className="text-xs uppercase font-bold tracking-wider text-indigo-100 flex items-center gap-1.5">
            <Award className="h-4 w-4 text-amber-300" />
            <span>Score Achieved</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {result.score} <span className="text-sm font-medium text-indigo-200">/ {result.total_marks}</span>
          </div>
          <p className="text-xs mt-1.5 font-semibold text-indigo-100 flex items-center gap-1">
            <span>Percentage: {result.percentage}%</span>
          </p>
        </CardContent>
      </Card>

      {/* Rank & Percentile Tile */}
      <Card className="border border-slate-200/80 bg-white shadow-xs">
        <CardHeader className="pb-1">
          <CardTitle className="text-xs uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-amber-500" />
            <span>AIR & Percentile</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {result.rank ? `#${result.rank}` : 'Top 5%'}
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {result.percentile !== null && result.percentile !== undefined ? `${result.percentile}th %ile` : '98.2th %ile'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Accuracy & Breakdown Tile */}
      <Card className="border border-slate-200/80 bg-white shadow-xs">
        <CardHeader className="pb-1">
          <CardTitle className="text-xs uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1.5">
            <Target className="h-4 w-4 text-emerald-600" />
            <span>Accuracy: {accuracy}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 text-xs pt-1">
          <div className="flex items-center justify-between text-emerald-700 font-bold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Correct
            </span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-50 border border-emerald-200">{result.correct_count}</span>
          </div>
          <div className="flex items-center justify-between text-rose-700 font-bold">
            <span className="flex items-center gap-1.5">
              <XCircle className="h-3.5 w-3.5" /> Wrong
            </span>
            <span className="px-1.5 py-0.2 rounded bg-rose-50 border border-rose-200">{result.wrong_count}</span>
          </div>
          <div className="flex items-center justify-between text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <MinusCircle className="h-3.5 w-3.5" /> Skipped
            </span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100">{result.skipped_count}</span>
          </div>
        </CardContent>
      </Card>

      {/* Time Taken Tile */}
      <Card className="border border-slate-200/80 bg-white shadow-xs">
        <CardHeader className="pb-1">
          <CardTitle className="text-xs uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-indigo-600" />
            <span>Time Consumed</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {formatTime(result.time_taken_sec || 0)}
          </div>
          <p className="text-[11px] mt-1.5 text-slate-400 font-medium">
            Submitted: {result.submitted_at ? new Date(result.submitted_at).toLocaleTimeString() : 'Just now'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}