import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, HelpCircle, Award, Play, Loader2 } from 'lucide-react';

export default function TestCard({ test, onStart, loading = false, disabled = false }) {
  const durationMin = Math.round((test.total_duration_sec || 0) / 60);

  return (
    <Card className="flex flex-col justify-between hover:shadow-md transition-shadow border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <Badge variant="outline" className="text-xs capitalize font-normal">
            {test.type?.replace('_', ' ') || 'Mock'}
          </Badge>
          {test.is_live && (
            <Badge variant="destructive" className="animate-pulse text-xs">
              LIVE NOW
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg leading-snug">{test.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 pb-3 text-xs text-muted-foreground">
        <div className="grid grid-cols-3 gap-2 py-2 border-y">
          <div className="flex flex-col items-center justify-center p-1.5 bg-muted/40 rounded">
            <Clock className="h-3.5 w-3.5 text-primary mb-1" />
            <span className="font-semibold text-foreground text-xs">{durationMin} min</span>
            <span className="text-[10px]">Duration</span>
          </div>
          <div className="flex flex-col items-center justify-center p-1.5 bg-muted/40 rounded">
            <Award className="h-3.5 w-3.5 text-primary mb-1" />
            <span className="font-semibold text-foreground text-xs">{test.total_marks || 100}</span>
            <span className="text-[10px]">Marks</span>
          </div>
          <div className="flex flex-col items-center justify-center p-1.5 bg-muted/40 rounded">
            <HelpCircle className="h-3.5 w-3.5 text-primary mb-1" />
            <span className="font-semibold text-foreground text-xs">
              {test.questions_count || test.test_questions_count || '--'}
            </span>
            <span className="text-[10px]">Questions</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-1">
        <Button
          onClick={() => onStart && onStart(test)}
          disabled={loading || disabled}
          className="w-full gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Starting...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-current" />
              Start Test
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}