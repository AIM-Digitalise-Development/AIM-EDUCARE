import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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
    <div className="space-y-6">
      {/* Question metadata badge */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="capitalize text-xs font-normal">
          Type: {type.replace('_', ' ')}
        </Badge>
        {question.marks_override && (
          <span className="text-xs text-muted-foreground">
            Marks: +{question.marks_override} / -{question.negative_override || 0}
          </span>
        )}
      </div>

      {/* Question Text */}
      <div className="text-base sm:text-lg font-medium leading-relaxed text-foreground whitespace-pre-line">
        {question.question_text}
      </div>

      {/* Question Image if any */}
      {question.question_image_url && (
        <div className="my-4 max-w-lg rounded-lg overflow-hidden border">
          <img
            src={question.question_image_url}
            alt="Question Diagram"
            className="w-full object-contain max-h-80"
          />
        </div>
      )}

      {/* Answer inputs based on type */}
      <div className="pt-4 border-t space-y-3">
        {isNumerical ? (
          <div className="max-w-xs space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">
              Enter Numerical Answer:
            </label>
            <Input
              type="number"
              step="any"
              placeholder="e.g. 42.5"
              value={currentAnswer !== undefined ? currentAnswer : ''}
              onChange={(e) => onAnswerChange(e.target.value)}
              className="text-lg font-mono"
            />
          </div>
        ) : (
          <div className="space-y-2.5">
            {(question.options || []).map((opt) => {
              const isSelected = isMulti
                ? Array.isArray(currentAnswer) && currentAnswer.includes(opt.option_key)
                : currentAnswer === opt.option_key;

              return (
                <div
                  key={opt.id || opt.option_key}
                  onClick={() => handleOptionToggle(opt.option_key)}
                  className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5 text-foreground shadow-sm'
                      : 'border-border hover:bg-muted/40 text-foreground/90'
                  }`}
                >
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {opt.option_key}
                  </div>
                  <div className="flex-1 text-sm pt-0.5 leading-snug">
                    {opt.option_text}
                    {opt.option_image_url && (
                      <img
                        src={opt.option_image_url}
                        alt={`Option ${opt.option_key}`}
                        className="mt-2 max-h-40 object-contain rounded"
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