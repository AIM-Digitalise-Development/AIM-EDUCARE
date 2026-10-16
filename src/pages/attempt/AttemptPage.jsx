import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useExamRunner } from '@/hooks/useExamRunner';
import { useAntiCheat } from '@/hooks/useAntiCheat';
import Timer from '@/components/attempt/Timer';
import QuestionPalette from '@/components/attempt/QuestionPalette';
import QuestionView from '@/components/attempt/QuestionView';
import SectionTabs from '@/components/attempt/SectionTabs';
import SubmitConfirmModal from '@/components/attempt/SubmitConfirmModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Bookmark, RotateCcw, Send, AlertCircle, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function AttemptPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const payload = useMemo(() => {
    try {
      const raw = sessionStorage.getItem(`aimeducare-attempt-payload-${attemptId}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [attemptId]);

  const examSlug = useMemo(() => {
    return sessionStorage.getItem(`aimeducare-attempt-exam-slug-${attemptId}`) || 'test';
  }, [attemptId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState(() => {
    if (payload?.sections_enabled && payload?.sections?.length > 0) {
      return payload.sections[0].id;
    }
    return null;
  });
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  // Anti-cheat hook
  useAntiCheat(attemptId, {
    enabled: true,
    onViolation: (v) => {
      // violation is saved to localStorage by hook
    },
  });

  // Exam runner lifecycle hook
  const {
    answers,
    setAnswer,
    clearAnswer,
    markedForReview,
    toggleMark,
    remainingSec,
    submitting,
    submit,
  } = useExamRunner(attemptId, payload);

  const allQuestions = payload?.questions || [];

  // Filter questions by section if sections_enabled
  const currentQuestions = useMemo(() => {
    if (payload?.sections_enabled && activeSectionId) {
      return allQuestions.filter((q) => q.section_id === activeSectionId);
    }
    return allQuestions;
  }, [allQuestions, payload?.sections_enabled, activeSectionId]);

  const currentQ = currentQuestions[currentIndex] || allQuestions[0];

  const handleNext = () => {
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleSelectSection = (secId) => {
    setActiveSectionId(secId);
    setCurrentIndex(0);
  };

  const handleFinalSubmit = async (reason = 'manual') => {
    try {
      const res = await submit(reason);
      toast.success('Test submitted successfully!');
      window.location.href = `/my-exams/${examSlug}/result/${attemptId}`;
    } catch (err) {
      toast.error('Failed to submit test. Please try again.');
    }
  };

  if (!payload || allQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <Card className="max-w-md p-8 text-center space-y-4 shadow-lg border">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-bold">Attempt Session Expired</h2>
          <p className="text-sm text-muted-foreground">
            The active test session could not be restored. Please return to the exam dashboard to start or resume.
          </p>
          <Button onClick={() => (window.location.href = `/my-exams/${examSlug}`)} className="w-full">
            Back to Exams
          </Button>
        </Card>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const markedCount = markedForReview.length;
  const totalCount = allQuestions.length;
  const unansweredCount = totalCount - answeredCount;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background select-none">
      {/* Top Runner Bar */}
      <header className="h-14 border-b bg-card px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold">
            <Shield className="h-3.5 w-3.5" />
            <span>PROCTORED</span>
          </div>
          <h1 className="font-bold text-sm sm:text-base truncate max-w-xs sm:max-w-md text-foreground">
            {payload.title}
          </h1>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Timer remainingSec={remainingSec} />
          <Button
            size="sm"
            onClick={() => setSubmitModalOpen(true)}
            className="gap-1.5 font-semibold text-xs h-8 bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-sm"
          >
            <Send className="h-3.5 w-3.5" />
            Submit Test
          </Button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Palette Column */}
        <aside className="w-72 border-r bg-card/60 p-4 flex flex-col shrink-0 hidden md:flex">
          {payload.sections_enabled && (
            <SectionTabs
              sections={payload.sections}
              activeSectionId={activeSectionId}
              onSelectSection={handleSelectSection}
            />
          )}

          <div className="flex-1 overflow-y-auto">
            <QuestionPalette
              questions={currentQuestions}
              currentIndex={currentIndex}
              answers={answers}
              markedForReview={markedForReview}
              onSelectQuestion={(idx) => setCurrentIndex(idx)}
            />
          </div>

          <div className="pt-3 border-t text-xs text-muted-foreground flex justify-between items-center">
            <span>Candidate: <strong>{user?.name || 'Student'}</strong></span>
          </div>
        </aside>

        {/* Center: Question Area */}
        <main className="flex-1 flex flex-col bg-background overflow-hidden">
          {/* Question sub-header */}
          <div className="h-11 px-6 border-b flex items-center justify-between text-xs text-muted-foreground bg-muted/20 shrink-0">
            <span>
              Question <strong className="text-foreground">{currentIndex + 1}</strong> of{' '}
              <strong className="text-foreground">{currentQuestions.length}</strong>
            </span>
            <span>
              Status:{' '}
              {answers[currentQ?.id] !== undefined ? (
                <strong className="text-emerald-600">Answered</strong>
              ) : (
                <strong>Unanswered</strong>
              )}
            </span>
          </div>

          {/* Question scrollable content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 max-w-4xl mx-auto w-full">
            <QuestionView
              question={currentQ}
              currentAnswer={answers[currentQ?.id]}
              onAnswerChange={(val) => {
                if (val === undefined || val === '') {
                  clearAnswer(currentQ?.id);
                } else {
                  setAnswer(currentQ?.id, val);
                }
              }}
            />
          </div>

          {/* Bottom Action Footer */}
          <footer className="h-16 border-t bg-card px-4 sm:px-8 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="gap-1 text-xs"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleMark(currentQ?.id)}
                className={`gap-1 text-xs ${
                  markedForReview.includes(currentQ?.id)
                    ? 'border-purple-600 text-purple-600 bg-purple-50'
                    : ''
                }`}
              >
                <Bookmark className="h-3.5 w-3.5" />
                {markedForReview.includes(currentQ?.id) ? 'Marked' : 'Mark for Review'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => clearAnswer(currentQ?.id)}
                className="gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Clear
              </Button>
            </div>

            <div>
              <Button
                size="sm"
                onClick={handleNext}
                disabled={currentIndex === currentQuestions.length - 1}
                className="gap-1 text-xs"
              >
                Save & Next
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </footer>
        </main>
      </div>

      {/* Submit Confirmation Modal */}
      <SubmitConfirmModal
        open={submitModalOpen}
        onOpenChange={setSubmitModalOpen}
        totalQuestions={totalCount}
        answeredCount={answeredCount}
        markedCount={markedCount}
        unansweredCount={unansweredCount}
        onSubmit={() => handleFinalSubmit('manual')}
        submitting={submitting}
      />
    </div>
  );
}