import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { subjectSchema } from '@/lib/validators';
import { adminCatalogApi } from '@/api/admin/catalog';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { ArrowLeft, Plus, Edit2, Trash2, Layers } from 'lucide-react';
import { toast } from 'sonner';

export default function SubjectsPage() {
  const { examId } = useParams();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: subjects, isLoading } = useQuery({
    queryKey: ['admin-subjects', examId],
    queryFn: async () => {
      const res = await adminCatalogApi.getSubjects(examId);
      return res.data?.data || [];
    },
  });

  const form = useForm({
    resolver: zodResolver(subjectSchema),
    defaultValues: { name: '', slug: '', sort_order: 0 },
  });

  const saveMutation = useMutation({
    mutationFn: async (values) => {
      if (editingSubject) {
        return adminCatalogApi.updateSubject(examId, editingSubject.id, values);
      }
      return adminCatalogApi.createSubject(examId, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-subjects', examId]);
      toast.success(editingSubject ? 'Subject updated' : 'Subject created');
      setModalOpen(false);
      setEditingSubject(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error saving subject');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (subjectId) => adminCatalogApi.deleteSubject(examId, subjectId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-subjects', examId]);
      toast.success('Subject deleted');
      setDeletingId(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete subject');
    },
  });

  const handleOpenCreate = () => {
    setEditingSubject(null);
    form.reset({ name: '', slug: '', sort_order: 0 });
    setModalOpen(true);
  };

  const handleOpenEdit = (sub) => {
    setEditingSubject(sub);
    form.reset({
      name: sub.name,
      slug: sub.slug || '',
      sort_order: sub.sort_order || 0,
    });
    setModalOpen(true);
  };

  const columns = [
    { key: 'id', header: 'ID', className: 'w-16 font-mono text-xs' },
    { key: 'name', header: 'Subject Name', className: 'font-medium' },
    { key: 'slug', header: 'Slug', className: 'font-mono text-xs text-muted-foreground' },
    { key: 'sort_order', header: 'Sort Order', className: 'w-24 text-center' },
    {
      key: 'actions',
      header: '',
      className: 'w-36 text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" asChild title="Manage Topics" className="h-8 w-8">
            <Link to={`/admin/subjects/${row.id}/topics`}>
              <Layers className="h-3.5 w-3.5 text-primary" />
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
          <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs text-muted-foreground mb-2">
            <Link to="/admin/exams">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Exams
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Exam Subjects</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Configure subjects and question syllabus domains for Exam #{examId}
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Subject
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={subjects}
        loading={isLoading}
        emptyMessage="No subjects added for this exam yet."
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSubject ? 'Edit Subject' : 'Add Subject'}</DialogTitle>
            <DialogDescription>Define subject domain name and ordering</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit((vals) => saveMutation.mutate(vals))} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Quantitative Aptitude" {...field} />
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
                      <Input placeholder="e.g. quantitative-aptitude" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sort_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort Order</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-4">
                <Button type="submit" disabled={saveMutation.isPending}>
                  {editingSubject ? 'Save Changes' : 'Create Subject'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(op) => !op && setDeletingId(null)}
        title="Delete Subject?"
        description="This will permanently delete the subject and related topics."
        onConfirm={() => deleteMutation.mutate(deletingId)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}