import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Award, HelpCircle, Play, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function TestCard({ test, onStart, loading = false }) {
  const isFree = test.is_free || test.price === 0;

  return (
    <Card className="flex flex-col justify-between border border-slate-200/80 bg-white hover:border-indigo-400 hover:shadow-md transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border-slate-200">
            {test.type?.replace('_', ' ') || 'Full Mock Test'}
          </Badge>
          {isFree ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              FREE TEST
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Pass Unlocked
            </span>
          )}
        </div>

        <CardTitle className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
          {test.title}
        </CardTitle>
        <CardDescription className="text-xs text-slate-500 line-clamp-1 mt-1">
          {test.description || 'Full syllabus test series designed for actual competitive exam simulation.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="py-2">
        <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-slate-50 border border-slate-100 text-center text-xs">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Duration</div>
            <div className="font-bold text-slate-800 mt-0.5 flex items-center justify-center gap-1">
              <Clock className="h-3 w-3 text-indigo-500" />
              <span>{Math.round((test.total_duration_sec || 3600) / 60)}m</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Marks</div>
            <div className="font-bold text-slate-800 mt-0.5 flex items-center justify-center gap-1">
              <Award className="h-3 w-3 text-amber-500" />
              <span>{test.total_marks || 100}</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Questions</div>
            <div className="font-bold text-slate-800 mt-0.5 flex items-center justify-center gap-1">
              <HelpCircle className="h-3 w-3 text-purple-500" />
              <span>{test.total_questions || test.questions_count || 100}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          onClick={() => onStart && onStart(test)}
          disabled={loading}
          className={`w-full font-bold text-xs h-9 shadow-sm ${
            isFree 
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          <Play className="mr-1.5 h-3.5 w-3.5 fill-current" />
          <span>{isFree ? 'Start Free Mock' : 'Start Test Now'}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}