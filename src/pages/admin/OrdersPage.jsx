import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminOrdersApi } from '@/api/admin/orders';
import DataTable from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Eye, ShoppingBag } from 'lucide-react';

export default function OrdersPage() {
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders', filterStatus],
    queryFn: async () => {
      const params = {};
      if (filterStatus && filterStatus.trim()) params.status = filterStatus;
      const res = await adminOrdersApi.getOrders(params);
      return res.data?.data?.items || res.data?.data || [];
    },
  });

  const columns = [
    { key: 'id', header: 'ID', className: 'w-16 font-mono text-xs' },
    {
      key: 'user',
      header: 'Candidate',
      render: (row) => (
        <div>
          <div className="font-semibold text-xs text-foreground">{row.user?.name || 'Customer'}</div>
          <div className="text-[11px] text-muted-foreground">{row.user?.email}</div>
        </div>
      ),
    },
    {
      key: 'plan',
      header: 'Plan / Exam',
      render: (row) => row.plan?.name || row.exam || '--',
    },
    {
      key: 'amount',
      header: 'Amount',
      className: 'font-bold text-xs',
      render: (row) => `₹${row.amount} ${row.currency || 'INR'}`,
    },
    {
      key: 'status',
      header: 'Status',
      className: 'w-24',
      render: (row) => (
        <Badge
          variant="secondary"
          className={`capitalize text-[10px] ${
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
      className: 'text-xs text-muted-foreground',
      render: (row) =>
        row.created_at ? new Date(row.created_at).toLocaleDateString() : '--',
    },
    {
      key: 'actions',
      header: '',
      className: 'w-16 text-right',
      render: (row) => (
        <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(row)} className="h-8 w-8">
          <Eye className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Billing & Invoices</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitor mock test subscription purchases and payment settlements
          </p>
        </div>

        <div className="w-48">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">All Statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        loading={isLoading}
        emptyMessage="No billing orders found."
        onRowClick={(row) => setSelectedOrder(row)}
      />

      <Dialog open={!!selectedOrder} onOpenChange={(op) => !op && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order Invoicing #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>Full settlement and gateway records</DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-3 py-2 text-xs">
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">User Name</span>
                <span className="font-medium text-foreground">{selectedOrder.user?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">User Email</span>
                <span>{selectedOrder.user?.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Gateway Ref</span>
                <span className="font-mono">{selectedOrder.gateway_payment_id || selectedOrder.gateway_order_id || '--'}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold">₹{selectedOrder.amount}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Status</span>
                <span className="capitalize font-semibold">{selectedOrder.status}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-muted-foreground">Timestamp</span>
                <span>{selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : '--'}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}