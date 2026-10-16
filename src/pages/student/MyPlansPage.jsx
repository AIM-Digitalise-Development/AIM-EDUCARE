import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/api/orders';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/shared/EmptyState';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Layers, Calendar, ArrowRight } from 'lucide-react';

export default function MyPlansPage() {
  const { data: plans, isLoading } = useQuery({
    queryKey: ['my-plans'],
    queryFn: async () => {
      const res = await ordersApi.getMyPlans();
      return res.data?.data || [];
    },
  });

  if (isLoading) {
    return <LoadingSpinner text="Loading your active plans..." />;
  }

  return (
    <div className="container px-4 sm:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Subscribed Plans</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          View your purchased test packages, validity, and mock test quotas
        </p>
      </div>

      {!plans || plans.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No plans active"
          description="You don't have any active mock test subscriptions."
          action={
            <Button asChild>
              <Link to="/exams">Browse Exam Plans</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((userPlan) => {
            const plan = userPlan.plan;
            const exam = userPlan.exam;
            return (
              <Card key={userPlan.id} className="border shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-xs">
                      {exam?.name || 'Exam'}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        userPlan.status === 'active'
                          ? 'text-emerald-600 bg-emerald-500/10'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {userPlan.status || 'Active'}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{plan?.name || 'Mock Plan'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between text-xs py-1 border-b">
                    <span>Mocks Included</span>
                    <span className="font-semibold text-foreground">
                      {userPlan.mocks_used || 0} / {userPlan.mocks_total || plan?.mock_count || '--'} used
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1 border-b">
                    <span>Valid Until</span>
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {userPlan.valid_till
                        ? new Date(userPlan.valid_till).toLocaleDateString()
                        : 'Unlimited'}
                    </span>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full mt-2">
                    <Link to={`/my-exams/${exam?.slug || ''}`}>
                      Go to Tests
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}