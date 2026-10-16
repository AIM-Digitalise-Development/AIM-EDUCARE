import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminOrdersApi } from '@/api/admin/orders';
import DataTable from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { Receipt } from 'lucide-react';

export default function TransactionsPage() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      const res = await adminOrdersApi.getTransactions();
      return res.data?.data?.items || res.data?.data || [];
    },
  });

  const columns = [
    { key: 'id', header: 'ID', className: 'w-16 font-mono text-xs' },
    {
      key: 'order_id',
      header: 'Order Ref',
      className: 'font-mono text-xs',
      render: (row) => `#${row.order_id}`,
    },
    {
      key: 'type',
      header: 'Type',
      className: 'capitalize text-xs',
      render: (row) => (
        <Badge variant="outline" className="font-normal text-[11px]">
          {row.type || 'payment'}
        </Badge>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      className: 'font-semibold text-xs',
      render: (row) => `₹${row.amount}`,
    },
    {
      key: 'gateway_ref',
      header: 'Gateway Payment ID',
      className: 'font-mono text-xs text-muted-foreground',
      render: (row) => row.gateway_ref || row.gateway_payment_id || '--',
    },
    {
      key: 'created_at',
      header: 'Timestamp',
      className: 'text-xs text-muted-foreground',
      render: (row) =>
        row.created_at ? new Date(row.created_at).toLocaleString() : '--',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment Transactions</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Audit ledger for Razorpay webhook confirmations, debits, and credit captures
        </p>
      </div>

      <DataTable
        columns={columns}
        data={transactions}
        loading={isLoading}
        emptyMessage="No payment transactions logged."
      />
    </div>
  );
}