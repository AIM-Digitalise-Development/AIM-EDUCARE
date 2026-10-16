import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/api/orders';
import { useRazorpay } from '@/hooks/useRazorpay';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { ShieldCheck, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { pay } = useRazorpay();

  const { data: order, isLoading } = useQuery({
    queryKey: ['checkout-order', orderId],
    queryFn: async () => {
      const res = await ordersApi.getMyOrders();
      const all = res.data?.data || [];
      return all.find((o) => String(o.id) === String(orderId));
    },
  });

  const handlePay = async () => {
    if (!order) return;
    await pay({
      planId: order.plan_id,
      examId: order.exam_id,
      onSuccess: () => {
        toast.success('Payment verified! Redirecting to your exams...');
        setTimeout(() => navigate('/my-exams'), 1500);
      },
    });
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading order checkout..." />;
  }

  if (!order) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-xl font-bold">Order not found</h2>
        <Button onClick={() => navigate('/my-orders')} className="mt-4">
          View My Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="container px-4 sm:px-8 py-10 max-w-lg">
      <Card className="border shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-1">
            <CreditCard className="h-4 w-4" />
            <span>CHECKOUT</span>
          </div>
          <CardTitle className="text-2xl font-bold">Complete Your Order</CardTitle>
          <CardDescription>Order #{order.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted/40 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Item:</span>
              <span className="font-semibold">{order.plan?.name || 'Mock Test Plan'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Exam:</span>
              <span>{order.exam || '--'}</span>
            </div>
            <div className="flex justify-between pt-2 border-t text-base font-bold">
              <span>Total Payable:</span>
              <span className="text-primary">₹{order.amount} {order.currency || 'INR'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Secured 256-bit payment processed via Razorpay</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handlePay} className="w-full h-11 text-base">
            Pay ₹{order.amount} Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}