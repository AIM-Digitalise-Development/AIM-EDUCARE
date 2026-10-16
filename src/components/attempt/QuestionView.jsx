import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Award, AlertCircle } from 'lucide-react';

export default function QuestionView({
  question,
  currentAnswer,
  onAnswerChange,
}) {
  if (!question) return null;

  const type = question.type || 'single_mcq';
  const isMulti = type === 'multi_mcq';
  const isNumerical = type === 'numerical';

  const handleOptionToggle = (key) => {
    if (isMulti) {
      const arr = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
      if (arr.includes(key)) {
        onAnswerChange(arr.filter((x) => x !== key));
      } else {
        onAnswerChange([...arr, key]);
      }
    } else {
      onAnswerChange(key);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Question metadata badge */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 capitalize">
            {type.replace('_', ' ')}
          </span>
          {isMulti && (
            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Multiple Options Allowed
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            +{question.marks_override || 1.0} Marks
          </span>
          <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
            -{question.negative_override || 0.25} Negative
          </span>
        </div>
      </div>

      {/* Question Text */}
      <div className="text-base sm:text-lg font-semibold leading-relaxed text-slate-900 whitespace-pre-line">
        {question.question_text}
      </div>

      {/* Question Image if any */}
      {question.question_image_url && (
        <div className="my-4 max-w-lg rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-white p-2">
          <img
            src={question.question_image_url}
            alt="Question Diagram"
            className="w-full object-contain max-h-80 rounded"
          />
        </div>
      )}

      {/* Answer inputs based on type */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        {isNumerical ? (
          <div className="max-w-xs space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Enter Numerical Answer:
            </label>
            <Input
              type="number"
              step="any"
              placeholder="e.g. 42.5"
              value={currentAnswer !== undefined && currentAnswer !== null ? currentAnswer : ''}
              onChange={(e) => onAnswerChange(e.target.value)}
              className="text-xl font-mono font-bold bg-white h-12"
            />
          </div>
        ) : (
          <div className="space-y-3">
            {(question.options || []).map((opt) => {
              const isSelected = isMulti
                ? Array.isArray(currentAnswer) && currentAnswer.includes(opt.option_key)
                : currentAnswer === opt.option_key;

              return (
                <div
                  key={opt.id || opt.option_key}
                  onClick={() => handleOptionToggle(opt.option_key)}
                  className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 text-slate-900 shadow-sm ring-1 ring-indigo-500/30'
                      : 'border-slate-200/90 bg-white hover:bg-slate-50/70 text-slate-800'
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all shadow-xs ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-indigo-500/30'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {opt.option_key}
                  </div>
                  <div className="flex-1 text-sm pt-0.5 leading-snug font-medium">
                    {opt.option_text}
                    {opt.option_image_url && (
                      <img
                        src={opt.option_image_url}
                        alt={`Option ${opt.option_key}`}
                        className="mt-2.5 max-h-40 object-contain rounded border border-slate-200"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}