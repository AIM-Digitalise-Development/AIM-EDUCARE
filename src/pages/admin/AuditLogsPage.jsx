import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminAuditLogsApi } from '@/api/admin/auditLogs';
import DataTable from '@/components/shared/DataTable';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, FileSpreadsheet } from 'lucide-react';

export default function AuditLogsPage() {
  const [actionFilter, setActionFilter] = useState('');

  const { data: logs, isLoading } = useQuery({
    queryKey: ['admin-audit-logs', actionFilter],
    queryFn: async () => {
      const params = {};
      if (actionFilter) params.action = actionFilter;
      const res = await adminAuditLogsApi.getLogs(params);
      return res.data?.data?.items || res.data?.data || [];
    },
  });

  const columns = [
    { key: 'id', header: 'ID', className: 'w-16 font-mono text-xs' },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <Badge variant="outline" className="font-mono text-xs font-semibold">
          {row.action}
        </Badge>
      ),
    },
    {
      key: 'user',
      header: 'Actor',
      className: 'text-xs',
      render: (row) => row.user?.name || (row.user_id ? `User #${row.user_id}` : 'System'),
    },
    {
      key: 'entity',
      header: 'Entity / Target',
      className: 'text-xs text-muted-foreground',
      render: (row) => (row.entity ? `${row.entity} #${row.entity_id || ''}` : '--'),
    },
    {
      key: 'ip',
      header: 'IP Address',
      className: 'font-mono text-xs text-muted-foreground',
      render: (row) => row.ip_address || row.ip || '--',
    },
    {
      key: 'created_at',
      header: 'Recorded At',
      className: 'text-xs text-muted-foreground',
      render: (row) =>
        row.created_at ? new Date(row.created_at).toLocaleString() : '--',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Audit Logs</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Immutable tracking log of administrative interventions, test publishing, and logins
          </p>
        </div>

        <div className="w-56 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter action keyword..."
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="pl-8 h-9 text-xs"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={logs}
        loading={isLoading}
        emptyMessage="No audit records found."
      />
    </div>
  );
}