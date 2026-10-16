import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUsersApi } from '@/api/admin/users';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Ban, CheckCircle, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [blockingUser, setBlockingUser] = useState(null);

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-users', { search, role, status }],
    queryFn: async () => {
      const params = {};
      if (search) params.search = search;
      if (role && role.trim()) params.role = role;
      if (status && status.trim()) params.status = status;
      const res = await adminUsersApi.getUsers(params);
      return res.data?.data?.items || res.data?.data || [];
    },
  });

  const toggleBlockMutation = useMutation({
    mutationFn: (userId) => adminUsersApi.toggleBlock(userId),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['admin-users']);
      toast.success(res.data?.message || 'User status updated');
      setBlockingUser(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update user status');
    },
  });

  const columns = [
    { key: 'id', header: 'ID', className: 'w-16 font-mono text-xs' },
    { key: 'name', header: 'Name', className: 'font-semibold text-sm' },
    { key: 'email', header: 'Email', className: 'text-xs text-muted-foreground' },
    { key: 'phone', header: 'Phone', className: 'text-xs font-mono', render: (row) => row.phone || '--' },
    {
      key: 'role',
      header: 'Role',
      className: 'w-24 capitalize text-xs',
      render: (row) => (
        <Badge variant="outline" className="text-[11px] font-normal capitalize">
          {row.role}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      className: 'w-24',
      render: (row) => (
        <Badge
          variant="secondary"
          className={`capitalize text-[10px] ${
            row.status === 'active'
              ? 'text-emerald-600 bg-emerald-500/10'
              : 'text-destructive bg-destructive/10'
          }`}
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'last_login_at',
      header: 'Last Login',
      className: 'text-xs text-muted-foreground',
      render: (row) =>
        row.last_login_at ? new Date(row.last_login_at).toLocaleDateString() : 'Never',
    },
    {
      key: 'actions',
      header: '',
      className: 'w-28 text-right',
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setBlockingUser(row)}
          className={`h-8 gap-1 text-xs ${
            row.status === 'blocked' ? 'text-emerald-600 hover:text-emerald-700' : 'text-destructive'
          }`}
        >
          {row.status === 'blocked' ? (
            <>
              <CheckCircle className="h-3.5 w-3.5" /> Unblock
            </>
          ) : (
            <>
              <Ban className="h-3.5 w-3.5" /> Block
            </>
          )}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Registered Users</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Monitor student registrations, roles, access statuses, and security flags
        </p>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-card p-4 rounded-xl border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-xs"
          />
        </div>
        <div>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">All Roles</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="subadmin">Sub-Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={usersData}
        loading={isLoading}
        emptyMessage="No users found matching current filters."
      />

      <ConfirmDialog
        open={!!blockingUser}
        onOpenChange={(op) => !op && setBlockingUser(null)}
        title={blockingUser?.status === 'blocked' ? 'Unblock User?' : 'Block User?'}
        description={
          blockingUser?.status === 'blocked'
            ? `Restore portal access for ${blockingUser?.name}.`
            : `Revoke all active tokens and restrict portal access for ${blockingUser?.name}.`
        }
        onConfirm={() => toggleBlockMutation.mutate(blockingUser.id)}
        confirmText={blockingUser?.status === 'blocked' ? 'Unblock' : 'Block User'}
        variant={blockingUser?.status === 'blocked' ? 'default' : 'destructive'}
        loading={toggleBlockMutation.isPending}
      />
    </div>
  );
}