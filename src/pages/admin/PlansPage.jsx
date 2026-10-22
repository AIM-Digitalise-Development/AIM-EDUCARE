import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { planSchema } from '@/lib/validators';
import { adminPlansApi } from '@/api/admin/plans';
import { adminCatalogApi } from '@/api/admin/catalog';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function PlansPage() {
  const queryClient = useQueryClient();
  const [filterExam, setFilterExam] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: exams = [] } = useQuery({
    queryKey: ['admin-exams-dropdown'],
    queryFn: async () => {
      const res = await adminCatalogApi.getExams();
      const raw = res.data?.data ?? res.data;
      if (Array.isArray(raw)) return raw;
      if (Array.isArray(raw?.items)) return raw.items;
      if (Array.isArray(raw?.data)) return raw.data;
      return [];
    },
  });

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['admin-plans', filterExam],
    queryFn: async () => {
      const params = {};
      if (filterExam) params.exam_id = filterExam;
      const res = await adminPlansApi.getPlans(params);
      const raw = res.data?.data ?? res.data;
      if (Array.isArray(raw)) return raw;
      if (Array.isArray(raw?.items)) return raw.items;
      if (Array.isArray(raw?.data)) return raw.data;
      if (Array.isArray(raw?.plans)) return raw.plans;
      return [];
    },
  });

  const form = useForm({
    resolver: zodResolver(planSchema),
    defaultValues: {
      exam_id: '',
      name: '',
      type: 'single',
      price: 99,
      mock_count: 1,
      validity_days: 365,
      is_active: true,
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (values) => {
      if (editingPlan) {
        return adminPlansApi.updatePlan(editingPlan.id, values);
      }
      return adminPlansApi.createPlan(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-plans']);
      toast.success(editingPlan ? 'Plan updated' : 'Plan created');
      setModalOpen(false);
      setEditingPlan(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error saving plan');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminPlansApi.deletePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-plans']);
      toast.success('Plan deleted');
      setDeletingId(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete plan');
    },
  });

  const handleOpenCreate = () => {
    setEditingPlan(null);
    form.reset({
      exam_id: exams?.[0]?.id ? String(exams[0].id) : '',
      name: '',
      type: 'single',
      price: 99,
      mock_count: 1,
      validity_days: 365,
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    form.reset({
      exam_id: String(plan.exam_id),
      name: plan.name,
      type: plan.type,
      price: plan.price,
      mock_count: plan.mock_count,
      validity_days: plan.validity_days || 365,
      is_active: Boolean(plan.is_active),
    });
    setModalOpen(true);
  };

  const columns = [
    { key: 'id', header: 'ID', className: 'w-16 font-mono text-xs' },
    { key: 'name', header: 'Plan Name', className: 'font-semibold text-sm' },
    {
      key: 'exam',
      header: 'Exam',
      render: (row) => row.exam?.name || '--',
    },
    {
      key: 'type',
      header: 'Type',
      className: 'capitalize text-xs',
      render: (row) => (
        <Badge variant="outline" className="text-[11px] font-normal">
          {row.type}
        </Badge>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (row) => <span className="font-bold">₹{row.price}</span>,
    },
    {
      key: 'mock_count',
      header: 'Mocks Included',
      className: 'text-center font-mono text-xs',
    },
    {
      key: 'is_active',
      header: 'Status',
      className: 'w-24',
      render: (row) => (
        <Badge variant={row.is_active ? 'secondary' : 'outline'} className="text-xs">
          {row.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
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
          <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Configure pricing tiers, mock test quotas, and bundle offerings
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Plan
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={plans}
        loading={isLoading}
        emptyMessage="No subscription plans configured yet."
      />

      {/* Plan Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPlan ? 'Edit Plan' : 'Create Plan'}</DialogTitle>
            <DialogDescription>Set exam plan price, mock quota, and duration</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit((vals) => saveMutation.mutate(vals))} className="space-y-3.5">
              <FormField
                control={form.control}
                name="exam_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Exam</FormLabel>
                    <Select onValueChange={field.onChange} value={String(field.value || '')}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Exam" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(exams || []).map((e) => (
                          <SelectItem key={e.id} value={String(e.id)}>
                            {e.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 5 Mock Tests Combo Pack" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="combo5">Combo 5</SelectItem>
                          <SelectItem value="combo10">Combo 10</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (INR)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="mock_count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mock Count</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="validity_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Validity (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <FormLabel className="text-sm font-normal">Active Status</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-4">
                <Button type="submit" disabled={saveMutation.isPending}>
                  {editingPlan ? 'Save Changes' : 'Create Plan'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(op) => !op && setDeletingId(null)}
        title="Delete Plan?"
        description="This will permanently delete the subscription package."
        onConfirm={() => deleteMutation.mutate(deletingId)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}