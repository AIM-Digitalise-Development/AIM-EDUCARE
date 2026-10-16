import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { examSchema } from '@/lib/validators';
import { adminCatalogApi } from '@/api/admin/catalog';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Edit2, Trash2, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function ExamsPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await adminCatalogApi.getCategories();
      return res.data?.data || [];
    },
  });

  const { data: exams, isLoading } = useQuery({
    queryKey: ['admin-exams'],
    queryFn: async () => {
      const res = await adminCatalogApi.getExams();
      return res.data?.data?.items || res.data?.data || [];
    },
  });

  const form = useForm({
    resolver: zodResolver(examSchema),
    defaultValues: {
      exam_category_id: '',
      name: '',
      slug: '',
      description: '',
      logo_url: '',
      is_active: true,
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (values) => {
      if (editingExam) {
        return adminCatalogApi.updateExam(editingExam.id, values);
      }
      return adminCatalogApi.createExam(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-exams']);
      toast.success(editingExam ? 'Exam updated' : 'Exam created');
      setModalOpen(false);
      setEditingExam(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error saving exam');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminCatalogApi.deleteExam(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-exams']);
      toast.success('Exam deleted');
      setDeletingId(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete exam');
    },
  });

  const handleOpenCreate = () => {
    setEditingExam(null);
    form.reset({
      exam_category_id: categories?.[0]?.id ? String(categories[0].id) : '',
      name: '',
      slug: '',
      description: '',
      logo_url: '',
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (exam) => {
    setEditingExam(exam);
    form.reset({
      exam_category_id: String(exam.exam_category_id || ''),
      name: exam.name,
      slug: exam.slug || '',
      description: exam.description || '',
      logo_url: exam.logo_url || '',
      is_active: Boolean(exam.is_active),
    });
    setModalOpen(true);
  };

  const columns = [
    { key: 'id', header: 'ID', className: 'w-16 font-mono text-xs' },
    { key: 'name', header: 'Name', className: 'font-medium' },
    {
      key: 'category',
      header: 'Category',
      render: (row) => row.category?.name || '--',
    },
    { key: 'slug', header: 'Slug', className: 'font-mono text-xs text-muted-foreground' },
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
      className: 'w-36 text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" asChild title="Manage Subjects" className="h-8 w-8">
            <Link to={`/admin/exams/${row.id}/subjects`}>
              <BookOpen className="h-3.5 w-3.5 text-primary" />
            </Link>
          </Button>
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
          <h1 className="text-3xl font-bold tracking-tight">Exams Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Create exams, manage descriptions, and configure subjects
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Exam
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={exams}
        loading={isLoading}
        emptyMessage="No exams configured yet."
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingExam ? 'Edit Exam' : 'Create Exam'}</DialogTitle>
            <DialogDescription>Configure exam series profile</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit((vals) => saveMutation.mutate(vals))} className="space-y-4">
              <FormField
                control={form.control}
                name="exam_category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={String(field.value || '')}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(categories || []).map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
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
                    <FormLabel>Exam Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. SBI PO 2026" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. sbi-po-2026" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Overview of exam syllabus and pattern..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                  {editingExam ? 'Save Changes' : 'Create Exam'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(op) => !op && setDeletingId(null)}
        title="Delete Exam?"
        description="This will permanently delete the exam, subjects, and test relationships."
        onConfirm={() => deleteMutation.mutate(deletingId)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}