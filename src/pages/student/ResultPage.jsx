import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { attemptsApi } from '@/api/attempts';
import ResultSummary from '@/components/exam/ResultSummary';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { ArrowLeft, CheckCircle2, XCircle, MinusCircle, Lock } from 'lucide-react';

export default function ResultPage() {
  const { slug, attemptId } = useParams();

  const { data: result, isLoading } = useQuery({
    queryKey: ['attempt-result', attemptId],
    queryFn: async () => {
      const res = await attemptsApi.getResult(attemptId);
      return res.data?.data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner text="Analyzing your test attempt results..." />;
  }

  if (!result) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-xl font-bold">Result not found</h2>
        <Button asChild className="mt-4">
          <Link to={`/my-exams/${slug || ''}`}>Back to Exams</Link>
        </Button>
      </div>
    );
  }

  const visibility = result.result_visibility || 'full';

  return (
    <div className="container px-4 sm:px-8 py-10 space-y-8">
      <div>
        <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs text-muted-foreground mb-4">
          <Link to={`/my-exams/${slug || ''}`}>
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Tests
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {result.test_title || 'Mock Test'} — Performance Report
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Detailed evaluation, ranking, and solutions review
        </p>
      </div>

      {visibility === 'hidden' ? (
        <Card className="p-8 text-center max-w-lg mx-auto">
          <Lock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <CardTitle className="text-lg">Results Currently Hidden</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            The results for this test will be published after the scheduled evaluation window closes.
          </p>
        </Card>
      ) : (
        <>
          <ResultSummary result={result} />

          {visibility === 'marks_only' && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 text-center space-y-3">
              <h3 className="text-base font-semibold text-foreground">Want in-depth question solutions?</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Subscribe to an active mock plan to unlock comprehensive question-wise explanations and analytics.
              </p>
              <Button asChild size="sm">
                <Link to={`/exams/${slug || ''}`}>Explore Full Plans</Link>
              </Button>
            </div>
          )}

          {visibility === 'full' && result.questions && result.questions.length > 0 && (
            <section className="space-y-4 pt-4">
              <h2 className="text-2xl font-bold tracking-tight">Question-by-Question Solutions</h2>
              <div className="space-y-4">
                {result.questions.map((q, idx) => (
                  <Card key={q.question_id || idx} className="border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">Q{idx + 1}.</span>
                          <Badge variant="outline" className="text-xs capitalize font-normal">
                            {q.type?.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div>
                          {q.is_correct ? (
                            <Badge className="bg-emerald-600 gap-1 text-xs">
                              <CheckCircle2 className="h-3 w-3" /> Correct (+{q.marks_awarded})
                            </Badge>
                          ) : q.given_answer !== null && q.given_answer !== undefined ? (
                            <Badge variant="destructive" className="gap-1 text-xs">
                              <XCircle className="h-3 w-3" /> Incorrect ({q.marks_awarded})
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="gap-1 text-xs text-muted-foreground">
                              <MinusCircle className="h-3 w-3" /> Skipped (0)
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-sm font-medium mt-2 leading-relaxed">
                        {q.question_text}
                      </div>
                      {q.question_image_url && (
                        <img
                          src={q.question_image_url}
                          alt="Question"
                          className="mt-2 max-h-48 object-contain rounded"
                        />
                      )}
                    </CardHeader>

                    <CardContent className="space-y-3 text-xs pt-0">
                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                          {q.options.map((opt) => {
                            const isGiven = Array.isArray(q.given_answer)
                              ? q.given_answer.includes(opt.option_key)
                              : q.given_answer === opt.option_key;
                            const isCorrect = opt.is_correct;

                            return (
                              <div
                                key={opt.id || opt.option_key}
                                className={`p-2.5 rounded border flex items-start gap-2 ${
                                  isCorrect
                                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 font-semibold'
                                    : isGiven
                                    ? 'border-destructive bg-destructive/10 text-destructive'
                                    : 'border-border'
                                }`}
                              >
                                <span className="font-bold">{opt.option_key}.</span>
                                <span className="flex-1">{opt.option_text}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {q.type === 'numerical' && (
                        <div className="p-2.5 rounded bg-muted/40 flex justify-between">
                          <span>Your Input: <strong>{q.given_answer ?? 'None'}</strong></span>
                          <span>Correct Answer: <strong className="text-emerald-600">{q.correct_answer}</strong></span>
                        </div>
                      )}

                      {q.explanation_text && (
                        <div className="p-3 rounded-lg bg-muted/30 border border-muted mt-2">
                          <span className="font-semibold text-foreground">Explanation: </span>
                          <span className="text-muted-foreground">{q.explanation_text}</span>
                          {q.explanation_image_url && (
                            <img
                              src={q.explanation_image_url}
                              alt="Explanation"
                              className="mt-2 max-h-48 object-contain rounded"
                            />
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}