import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSubAdminsApi } from '@/api/admin/subAdmins';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, ShieldCheck, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

const ALL_PERMISSIONS = [
  { key: 'upload_questions', label: 'Upload Questions' },
  { key: 'create_test', label: 'Create Test' },
  { key: 'publish_test', label: 'Publish Test' },
  { key: 'view_reports', label: 'View Reports & Dashboard' },
  { key: 'manage_users', label: 'Manage Users' },
  { key: 'manage_plans', label: 'Manage Plans' },
  { key: 'manage_orders', label: 'Manage Orders' },
  { key: 'manage_subadmins', label: 'Manage Sub-Admins' },
];

export default function SubAdminsPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubAdmin, setEditingSubAdmin] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const { data: subadmins, isLoading } = useQuery({
    queryKey: ['admin-subadmins'],
    queryFn: async () => {
      const res = await adminSubAdminsApi.getSubAdmins();
      return res.data?.data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingSubAdmin) {
        return adminSubAdminsApi.updateSubAdmin(editingSubAdmin.id, payload);
      }
      return adminSubAdminsApi.createSubAdmin(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-subadmins']);
      toast.success(editingSubAdmin ? 'Sub-Admin updated' : 'Sub-Admin created');
      setModalOpen(false);
      setEditingSubAdmin(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error saving sub-admin');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminSubAdminsApi.deleteSubAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-subadmins']);
      toast.success('Sub-Admin deleted');
      setDeletingId(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete sub-admin');
    },
  });

  const handleOpenCreate = () => {
    setEditingSubAdmin(null);
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setSelectedPermissions([]);
    setModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingSubAdmin(user);
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone || '');
    setPassword('');
    const userPerms = (user.permissions || user.sub_admin_permissions || []).map(
      (p) => (typeof p === 'string' ? p : p.permission_key)
    );
    setSelectedPermissions(userPerms);
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Name is required');
    if (!email.trim()) return toast.error('Email is required');
    if (!editingSubAdmin && !password) return toast.error('Password is required');

    const payload = {
      name,
      email,
      phone: phone || null,
      permissions: selectedPermissions,
    };
    if (password) payload.password = password;

    saveMutation.mutate(payload);
  };

  const columns = [
    { key: 'id', header: 'ID', className: 'w-16 font-mono text-xs' },
    { key: 'name', header: 'Staff Name', className: 'font-semibold text-sm' },
    { key: 'email', header: 'Email', className: 'text-xs text-muted-foreground' },
    {
      key: 'permissions',
      header: 'Assigned Permissions',
      render: (row) => {
        const perms = row.permissions || [];
        return (
          <div className="flex flex-wrap gap-1 max-w-md">
            {perms.length === 0 ? (
              <span className="text-xs text-muted-foreground italic">None assigned</span>
            ) : (
              perms.map((p) => (
                <Badge key={typeof p === 'string' ? p : p.permission_key} variant="secondary" className="text-[10px] font-normal">
                  {(typeof p === 'string' ? p : p.permission_key).replace(/_/g, ' ')}
                </Badge>
              ))
            )}
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: '',
      className: 'w-24 text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(row)} className="h-8 w-8">
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeletingId(row.id)} className="h-8 w-8 text-destructive">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff & Sub-Admins</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Delegate operational roles with role-based access control and granular permission keys
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Sub-Admin
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={subadmins}
        loading={isLoading}
        emptyMessage="No sub-administrators configured yet."
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSubAdmin ? 'Edit Sub-Admin' : 'New Sub-Admin'}</DialogTitle>
            <DialogDescription>Assign credentials and capability authorizations</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold">Staff Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
            </div>

            <div>
              <label className="text-xs font-semibold">Email Address</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
            </div>

            <div>
              <label className="text-xs font-semibold">Phone Number (Optional)</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" />
            </div>

            <div>
              <label className="text-xs font-semibold">Password {editingSubAdmin && '(Leave blank to retain)'}</label>
              <Input
                type="password"
                placeholder={editingSubAdmin ? '••••••••' : 'Min 8 characters'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="space-y-2 pt-2 border-t">
              <label className="text-xs font-semibold">Authorized Role Capabilities</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {ALL_PERMISSIONS.map((perm) => {
                  const isChecked = selectedPermissions.includes(perm.key);
                  return (
                    <div
                      key={perm.key}
                      onClick={() => {
                        if (isChecked) {
                          setSelectedPermissions((p) => p.filter((x) => x !== perm.key));
                        } else {
                          setSelectedPermissions((p) => [...p, perm.key]);
                        }
                      }}
                      className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${
                        isChecked ? 'border-primary bg-primary/5 font-semibold text-primary' : 'hover:bg-muted/40'
                      }`}
                    >
                      <Checkbox checked={isChecked} />
                      <span className="text-[11px] leading-tight">{perm.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button type="submit" disabled={saveMutation.isPending}>
                {editingSubAdmin ? 'Save Changes' : 'Create Sub-Admin'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(op) => !op && setDeletingId(null)}
        title="Revoke Sub-Admin Access?"
        description="This administrator account and all associated tokens will be deleted."
        onConfirm={() => deleteMutation.mutate(deletingId)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}