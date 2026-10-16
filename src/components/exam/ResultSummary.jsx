import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Award, CheckCircle2, XCircle, MinusCircle, Clock, TrendingUp } from 'lucide-react';

export default function ResultSummary({ result }) {
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Score */}
      <Card className="bg-primary text-primary-foreground">
        <CardHeader className="pb-1">
          <CardTitle className="text-xs uppercase font-medium tracking-wider text-primary-foreground/80 flex items-center gap-1.5">
            <Award className="h-4 w-4" />
            Your Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-black">
            {result.score} <span className="text-sm font-normal text-primary-foreground/80">/ {result.total_marks}</span>
          </div>
          <p className="text-xs mt-1 text-primary-foreground/90">
            Percentage: {result.percentage}%
          </p>
        </CardContent>
      </Card>

      {/* Accuracy / Rank */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-xs uppercase font-medium tracking-wider text-muted-foreground flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-primary" />
            Rank & Percentile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {result.rank ? `#${result.rank}` : '--'}
          </div>
          <p className="text-xs mt-1 text-muted-foreground">
            Percentile: {result.percentile !== null ? `${result.percentile}%` : '--'}
          </p>
        </CardContent>
      </Card>

      {/* Breakdown */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-xs uppercase font-medium tracking-wider text-muted-foreground">
            Attempt Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-xs">
          <div className="flex items-center justify-between text-emerald-600 font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Correct
            </span>
            <span>{result.correct_count}</span>
          </div>
          <div className="flex items-center justify-between text-destructive font-medium">
            <span className="flex items-center gap-1">
              <XCircle className="h-3.5 w-3.5" /> Wrong
            </span>
            <span>{result.wrong_count}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground font-medium">
            <span className="flex items-center gap-1">
              <MinusCircle className="h-3.5 w-3.5" /> Skipped
            </span>
            <span>{result.skipped_count}</span>
          </div>
        </CardContent>
      </Card>

      {/* Time Taken */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="text-xs uppercase font-medium tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" />
            Time Taken
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatTime(result.time_taken_sec || 0)}
          </div>
          <p className="text-xs mt-1 text-muted-foreground">
            Submitted: {result.submitted_at ? new Date(result.submitted_at).toLocaleDateString() : 'Just now'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}