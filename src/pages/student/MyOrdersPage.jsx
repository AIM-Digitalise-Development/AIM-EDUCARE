import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/api/orders';
import DataTable from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Eye } from 'lucide-react';

export default function MyOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const res = await ordersApi.getMyOrders();
      return res.data?.data || [];
    },
  });

  const columns = [
    { key: 'id', header: 'Order ID', render: (row) => `#${row.id}` },
    {
      key: 'exam',
      header: 'Exam',
      render: (row) => row.exam || row.plan?.name || 'Mock Plan',
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (row) => `₹${row.amount}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Badge
          variant="secondary"
          className={`capitalize text-xs ${
            row.status === 'paid'
              ? 'text-emerald-600 bg-emerald-500/10'
              : row.status === 'pending'
              ? 'text-amber-600 bg-amber-500/10'
              : 'text-destructive bg-destructive/10'
          }`}
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (row) =>
        row.created_at ? new Date(row.created_at).toLocaleDateString() : '--',
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedOrder(row);
          }}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="container px-4 sm:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Order History</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Review your transaction receipts and payment details
        </p>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        loading={isLoading}
        emptyMessage="You have not placed any orders yet."
        onRowClick={(row) => setSelectedOrder(row)}
      />

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>Transaction and plan details</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-3 py-2 text-sm">
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Status</span>
                <span className="font-semibold capitalize">{selectedOrder.status}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold">₹{selectedOrder.amount} {selectedOrder.currency}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Gateway Ref</span>
                <span className="font-mono text-xs">{selectedOrder.gateway_payment_id || selectedOrder.gateway_order_id || '--'}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Date</span>
                <span>{selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : '--'}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}