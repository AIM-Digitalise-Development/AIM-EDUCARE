import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';

export default function SubmitConfirmModal({
  open,
  onOpenChange,
  totalQuestions = 0,
  answeredCount = 0,
  markedCount = 0,
  unansweredCount = 0,
  onSubmit,
  submitting = false,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-amber-500 mb-1">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Submit Test Confirmation</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to end and submit this test? You will not be able to change your answers after submission.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3 my-4 p-4 rounded-lg bg-muted/40 text-center">
          <div>
            <div className="text-xl font-bold text-foreground">{totalQuestions}</div>
            <div className="text-xs text-muted-foreground">Total Questions</div>
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-600">{answeredCount}</div>
            <div className="text-xs text-muted-foreground">Answered</div>
          </div>
          <div>
            <div className="text-xl font-bold text-amber-600">{unansweredCount}</div>
            <div className="text-xs text-muted-foreground">Unanswered</div>
          </div>
        </div>

        {markedCount > 0 && (
          <p className="text-xs text-purple-600 font-medium">
            Note: You still have {markedCount} questions marked for review.
          </p>
        )}

        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel & Return to Test
          </Button>
          <Button
            variant="default"
            onClick={onSubmit}
            disabled={submitting}
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm & Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}