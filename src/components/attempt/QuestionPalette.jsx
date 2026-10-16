export default function QuestionPalette({
  questions = [],
  currentIndex = 0,
  answers = {},
  markedForReview = [],
  onSelectQuestion,
}) {
  const getStatus = (q, index) => {
    const isMarked = markedForReview.includes(q.id);
    const hasAnswer = answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== '';

    if (isMarked) return 'marked';
    if (hasAnswer) return 'answered';
    if (index === currentIndex) return 'current';
    return 'not_answered';
  };

  const getBadgeStyle = (status, isCurrent) => {
    let base = 'h-9 w-9 text-xs font-semibold rounded-md flex items-center justify-center transition-all cursor-pointer ';
    if (isCurrent) base += 'ring-2 ring-primary ring-offset-2 ';

    switch (status) {
      case 'answered':
        return base + 'bg-emerald-600 text-white hover:bg-emerald-700';
      case 'marked':
        return base + 'bg-purple-600 text-white hover:bg-purple-700';
      case 'current':
        return base + 'bg-primary/20 text-primary border border-primary';
      default:
        return base + 'bg-muted text-muted-foreground hover:bg-muted/80';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="font-semibold text-xs tracking-wider text-muted-foreground uppercase mb-3">
        Question Palette ({questions.length})
      </div>

      <div className="grid grid-cols-5 gap-2 overflow-y-auto max-h-[360px] p-1">
        {questions.map((q, idx) => {
          const status = getStatus(q, idx);
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={q.id || idx}
              type="button"
              onClick={() => onSelectQuestion(idx)}
              className={getBadgeStyle(status, isCurrent)}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t space-y-2 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-emerald-600 shrink-0" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-purple-600 shrink-0" />
          <span>Marked for Review</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-muted shrink-0" />
          <span>Not Answered</span>
        </div>
      </div>
    </div>
  );
}