import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, Sparkles } from 'lucide-react';

export default function PlanCard({ plan, onBuy, loading = false }) {
  const isCombo = plan.type?.includes('combo') || plan.mock_count > 1;

  return (
    <Card
      className={`flex flex-col justify-between relative border transition-all ${
        isCombo ? 'border-primary/60 shadow-md ring-1 ring-primary/20' : 'hover:border-primary/40'
      }`}
    >
      {isCombo && (
        <div className="absolute -top-3 right-4">
          <Badge className="bg-primary text-primary-foreground text-xs gap-1 py-0.5">
            <Sparkles className="h-3 w-3" />
            Popular Value
          </Badge>
        </div>
      )}

      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{plan.name}</CardTitle>
          <Badge variant="secondary" className="capitalize text-xs font-normal">
            {plan.type?.replace('_', ' ') || 'Plan'}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Validity: {plan.validity_days || 365} days
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold tracking-tight">₹{plan.price}</span>
          <span className="text-xs text-muted-foreground">/ one-time</span>
        </div>

        <ul className="space-y-2 text-sm text-muted-foreground pt-2 border-t">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>
              <strong>{plan.mock_count}</strong> Full Mock {plan.mock_count > 1 ? 'Tests' : 'Test'}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Instant Rank & Percentile</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Detailed Solutions & Analysis</span>
          </li>
        </ul>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          onClick={() => onBuy && onBuy(plan)}
          disabled={loading}
          className="w-full"
          variant={isCombo ? 'default' : 'outline'}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Buy Plan'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}