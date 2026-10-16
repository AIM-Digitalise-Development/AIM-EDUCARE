export default function QuestionPalette({
  questions = [],
  currentIndex = 0,
  answers = {},
  markedForReview = [],
  visitedQuestions = [],
  onSelectQuestion,
}) {
  const getStatus = (q, index) => {
    const isMarked = markedForReview.includes(q.id);
    const hasAnswer = answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== '';
    const isVisited = (visitedQuestions && visitedQuestions.includes(q.id)) || index === currentIndex;

    if (isMarked && hasAnswer) return 'marked_answered';
    if (isMarked) return 'marked';
    if (hasAnswer) return 'answered';
    if (isVisited) return 'not_answered';
    return 'not_visited';
  };

  const counts = {
    answered: 0,
    not_answered: 0,
    marked: 0,
    not_visited: 0,
  };

  questions.forEach((q, idx) => {
    const s = getStatus(q, idx);
    if (s === 'answered' || s === 'marked_answered') counts.answered++;
    else if (s === 'marked') counts.marked++;
    else if (s === 'not_answered') counts.not_answered++;
    else counts.not_visited++;
  });

  const getBadgeStyle = (status, isCurrent) => {
    let base = 'h-9 w-9 text-xs font-bold rounded-lg flex items-center justify-center transition-all cursor-pointer relative shadow-xs ';
    if (isCurrent) base += 'ring-2 ring-indigo-600 ring-offset-2 scale-105 z-10 ';

    switch (status) {
      case 'answered':
        return base + 'bg-emerald-600 text-white hover:bg-emerald-700';
      case 'marked_answered':
        return base + 'bg-purple-600 text-white hover:bg-purple-700';
      case 'marked':
        return base + 'bg-purple-600 text-white hover:bg-purple-700';
      case 'not_answered':
        return base + 'bg-rose-500 text-white hover:bg-rose-600';
      default:
        return base + 'bg-slate-100 text-slate-700 border border-slate-200/80 hover:bg-slate-200';
    }
  };

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Live Stat Badges Header */}
      <div className="grid grid-cols-2 gap-2 mb-4 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] font-semibold">
        <div className="flex items-center gap-1.5 text-emerald-700">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 shrink-0" />
          <span>Answered: <strong>{counts.answered}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-rose-700">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shrink-0" />
          <span>Not Answered: <strong>{counts.not_answered}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-purple-700">
          <span className="h-2.5 w-2.5 rounded-full bg-purple-600 shrink-0" />
          <span>Review: <strong>{counts.marked}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300 shrink-0" />
          <span>Not Visited: <strong>{counts.not_visited}</strong></span>
        </div>
      </div>

      <div className="flex items-center justify-between font-bold text-xs text-slate-700 uppercase tracking-wider mb-2 px-1">
        <span>Question Palette</span>
        <span className="text-slate-400 font-mono text-[11px]">{questions.length} Items</span>
      </div>

      {/* Palette Number Grid */}
      <div className="grid grid-cols-5 gap-2 overflow-y-auto max-h-[340px] p-1.5 bg-white rounded-xl border border-slate-100 shadow-inner">
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
              <span>{idx + 1}</span>
              {status === 'marked_answered' && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 border border-white" />
              )}
            </button>
          );
        })}
      </div>

      {/* Palette Legend */}
      <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[10px] text-slate-500 font-medium">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-md bg-emerald-600 shrink-0" />
          <span>Answered Question</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-md bg-rose-500 shrink-0" />
          <span>Not Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-md bg-purple-600 shrink-0" />
          <span>Marked for Review</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-md bg-slate-100 border border-slate-300 shrink-0" />
          <span>Not Visited Yet</span>
        </div>
      </div>
    </div>
  );
}