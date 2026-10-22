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
import { Plus, ShieldCheck, Trash2, Edit2, ShieldAlert, KeyRound, Lock, UserCheck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const ALL_PERMISSIONS = [
  { key: 'upload_questions', label: 'Upload Questions', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { key: 'create_test', label: 'Create Test', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { key: 'publish_test', label: 'Publish Test', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { key: 'view_reports', label: 'View Reports & Dashboard', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { key: 'manage_users', label: 'Manage Candidates', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { key: 'manage_plans', label: 'Manage Plans', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { key: 'manage_orders', label: 'Manage Orders', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { key: 'manage_subadmins', label: 'Manage Sub-Admins', color: 'bg-amber-50 text-amber-700 border-amber-200' },
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
  const [fieldErrors, setFieldErrors] = useState({});

  const { data: subadmins = [], isLoading } = useQuery({
    queryKey: ['admin-subadmins'],
    queryFn: async () => {
      const res = await adminSubAdminsApi.getSubAdmins();
      const raw = res.data?.data ?? res.data;
      if (Array.isArray(raw)) return raw;
      if (Array.isArray(raw?.items)) return raw.items;
      if (Array.isArray(raw?.data)) return raw.data;
      return [];
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
      toast.success(editingSubAdmin ? 'Sub-Admin updated successfully' : 'Sub-Admin created successfully');
      setModalOpen(false);
      setEditingSubAdmin(null);
      setFieldErrors({});
    },
    onError: (err) => {
      const errorData = err.response?.data;
      if (errorData?.errors) {
        setFieldErrors(errorData.errors);
        const firstMsg = Object.values(errorData.errors).flat()[0];
        toast.error(firstMsg || errorData.message || 'Validation error');
      } else {
        toast.error(errorData?.message || 'Error saving sub-admin');
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminSubAdminsApi.deleteSubAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-subadmins']);
      toast.success('Sub-Admin access revoked');
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
    setFieldErrors({});
    setModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingSubAdmin(user);
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone || '');
    setPassword('');
    setFieldErrors({});
    const userPerms = (user.permissions || user.sub_admin_permissions || []).map(
      (p) => (typeof p === 'string' ? p : p.permission_key)
    );
    setSelectedPermissions(userPerms);
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setFieldErrors({});

    const errors = {};
    if (!name.trim()) errors.name = ['Staff name is required.'];
    if (!email.trim()) errors.email = ['Email address is required.'];
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = ['Please enter a valid email address.'];
    
    if (!editingSubAdmin) {
      if (!password) errors.password = ['Password is required.'];
      else if (password.length < 8) errors.password = ['Password must be at least 8 characters.'];
    } else if (password && password.length < 8) {
      errors.password = ['Password must be at least 8 characters.'];
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const first = Object.values(errors).flat()[0];
      return toast.error(first);
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() ? phone.trim() : null,
      permissions: selectedPermissions,
    };
    if (password) payload.password = password;

    saveMutation.mutate(payload);
  };

  const columns = [
    { key: 'id', header: 'ID', className: 'w-16 font-mono text-xs font-semibold text-slate-500' },
    { 
      key: 'name', 
      header: 'Staff Member', 
      className: 'font-semibold text-sm',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
            {row.name ? row.name[0].toUpperCase() : 'S'}
          </div>
          <div>
            <div className="font-bold text-slate-900">{row.name}</div>
            <div className="text-[11px] text-slate-400">{row.phone || 'No phone'}</div>
          </div>
        </div>
      )
    },
    { key: 'email', header: 'Email Address', className: 'text-xs text-slate-600 font-mono' },
    {
      key: 'permissions',
      header: 'Assigned Role Capabilities',
      render: (row) => {
        const perms = (row.permissions || row.sub_admin_permissions || []).map(
          (p) => (typeof p === 'string' ? p : p.permission_key)
        );
        return (
          <div className="flex flex-wrap gap-1.5 max-w-md">
            {perms.length === 0 ? (
              <span className="text-xs text-slate-400 italic">No capabilities assigned</span>
            ) : (
              perms.map((key) => {
                const meta = ALL_PERMISSIONS.find((p) => p.key === key);
                return (
                  <Badge 
                    key={key} 
                    variant="outline" 
                    className={`text-[10px] font-semibold ${meta?.color || 'bg-slate-100 text-slate-700'}`}
                  >
                    {meta?.label || key.replace(/_/g, ' ')}
                  </Badge>
                );
              })
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
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleOpenEdit(row)} 
            className="h-8 w-8 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
            title="Edit Sub-Admin"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setDeletingId(row.id)} 
            className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
            title="Revoke Access"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Staff & Sub-Administrators
          </h1>
          <p className="text-slate-500 mt-1 text-xs sm:text-sm">
            Delegate test builder, question authoring, and candidate management roles with granular permissions
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm">
          <Plus className="h-4 w-4" />
          Add Sub-Admin
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={subadmins}
        loading={isLoading}
        emptyMessage="No sub-administrators configured yet. Click 'Add Sub-Admin' to create one."
      />

      {/* Add / Edit Sub-Admin Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
              <span>{editingSubAdmin ? 'Edit Sub-Administrator' : 'Create New Sub-Administrator'}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Configure credentials and assign role permissions for this staff account.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-700">Staff Name *</label>
              <Input 
                value={name} 
                onChange={(e) => { 
                  setName(e.target.value); 
                  if (fieldErrors.name) setFieldErrors(prev => ({...prev, name: null})); 
                }} 
                placeholder="e.g. Rahul Sharma"
                className={`mt-1 h-9 text-xs ${fieldErrors.name ? 'border-destructive ring-1 ring-destructive' : ''}`} 
              />
              {fieldErrors.name && (
                <p className="text-[11px] text-destructive mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{fieldErrors.name[0]}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Email Address *</label>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => { 
                    setEmail(e.target.value); 
                    if (fieldErrors.email) setFieldErrors(prev => ({...prev, email: null})); 
                  }} 
                  placeholder="staff@aimeducare.com"
                  className={`mt-1 h-9 text-xs font-mono ${fieldErrors.email ? 'border-destructive ring-1 ring-destructive' : ''}`} 
                />
                {fieldErrors.email && (
                  <p className="text-[11px] text-destructive mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{fieldErrors.email[0]}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Phone (Optional)</label>
                <Input 
                  value={phone} 
                  onChange={(e) => { 
                    setPhone(e.target.value); 
                    if (fieldErrors.phone) setFieldErrors(prev => ({...prev, phone: null})); 
                  }} 
                  placeholder="e.g. 9876543210"
                  className={`mt-1 h-9 text-xs ${fieldErrors.phone ? 'border-destructive ring-1 ring-destructive' : ''}`} 
                />
                {fieldErrors.phone && (
                  <p className="text-[11px] text-destructive mt-1 font-medium flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{fieldErrors.phone[0]}</span>
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">
                Password {editingSubAdmin ? '(Leave blank to retain current password)' : '*'}
              </label>
              <Input
                type="password"
                placeholder={editingSubAdmin ? '••••••••' : 'Minimum 8 characters'}
                value={password}
                onChange={(e) => { 
                  setPassword(e.target.value); 
                  if (fieldErrors.password) setFieldErrors(prev => ({...prev, password: null})); 
                }}
                className={`mt-1 h-9 text-xs ${fieldErrors.password ? 'border-destructive ring-1 ring-destructive' : ''}`}
              />
              {fieldErrors.password ? (
                <p className="text-[11px] text-destructive mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>{fieldErrors.password[0]}</span>
                </p>
              ) : (
                <p className="text-[10px] text-slate-400 mt-1">Must be at least 8 characters long.</p>
              )}
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block">
                Authorized Platform Capabilities
              </label>
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
                      className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition-all ${
                        isChecked 
                          ? 'border-indigo-600 bg-indigo-50/70 font-semibold text-indigo-900 shadow-xs' 
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Checkbox checked={isChecked} />
                      <span className="text-[11px] leading-tight select-none">{perm.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <DialogFooter className="mt-5 pt-3 border-t border-slate-100">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setModalOpen(false)}
                className="text-xs h-9"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={saveMutation.isPending}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-9 shadow-sm"
              >
                {saveMutation.isPending ? 'Saving...' : editingSubAdmin ? 'Save Changes' : 'Create Sub-Admin'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(op) => !op && setDeletingId(null)}
        title="Revoke Sub-Admin Access?"
        description="This administrator account and all associated login sessions will be permanently revoked."
        onConfirm={() => deleteMutation.mutate(deletingId)}
        loading={deleteMutation.isPending}
        confirmText="Revoke Access"
        variant="destructive"
      />
    </div>
  );
}