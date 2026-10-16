import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export default function PlanCard({ plan, onBuy, loading = false }) {
  const isCombo = plan.type?.includes('combo') || plan.mock_count > 1;

  return (
    <Card
      className={`flex flex-col justify-between relative border transition-all duration-200 overflow-hidden ${
        isCombo 
          ? 'border-indigo-500/80 shadow-xl ring-2 ring-indigo-500/20 bg-gradient-to-b from-indigo-50/30 via-white to-white' 
          : 'border-slate-200/80 bg-white hover:border-indigo-400 hover:shadow-lg'
      }`}
    >
      {isCombo && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider py-1 text-center shadow-xs">
          ⭐ Most Popular Value Pass
        </div>
      )}

      <CardHeader className="pt-5 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-slate-900">{plan.name}</CardTitle>
          <Badge variant={isCombo ? 'default' : 'secondary'} className={`capitalize text-[11px] font-semibold ${isCombo ? 'bg-indigo-600' : 'bg-slate-100 text-slate-700'}`}>
            {plan.type?.replace('_', ' ') || 'Mock Pass'}
          </Badge>
        </div>
        <CardDescription className="text-xs text-slate-500 mt-1">
          Validity: <strong className="text-slate-700">{plan.validity_days || 365} Days</strong> full access
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-1 py-1">
          <span className="text-3xl font-extrabold tracking-tight text-slate-900">₹{plan.price}</span>
          <span className="text-xs text-slate-500 font-medium">/ one-time pass</span>
        </div>

        <ul className="space-y-2.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-semibold text-slate-800">
              {plan.mock_count} Full-Length Mock {plan.mock_count > 1 ? 'Tests' : 'Test'}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Real TCS-iON & NTA Pattern CBT</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Instant All-India Rank & Percentile</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Comprehensive Solutions & Cutoff Analysis</span>
          </li>
        </ul>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          onClick={() => onBuy && onBuy(plan)}
          disabled={loading}
          className={`w-full font-bold text-xs h-10 shadow-sm transition-all ${
            isCombo 
              ? 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md shadow-indigo-500/25' 
              : 'bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initializing Razorpay...
            </>
          ) : (
            isCombo ? '⚡ Unlock Combo Pass' : 'Unlock Mock Pass'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}