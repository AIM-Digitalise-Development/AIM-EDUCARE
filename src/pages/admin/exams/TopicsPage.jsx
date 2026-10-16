import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { topicSchema } from '@/lib/validators';
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
import { ArrowLeft, Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function TopicsPage() {
  const { subjectId } = useParams();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: topics, isLoading } = useQuery({
    queryKey: ['admin-topics', subjectId],
    queryFn: async () => {
      const res = await adminCatalogApi.getTopics(subjectId);
      return res.data?.data || [];
    },
  });

  const form = useForm({
    resolver: zodResolver(topicSchema),
    defaultValues: { name: '', slug: '' },
  });

  const saveMutation = useMutation({
    mutationFn: async (values) => {
      if (editingTopic) {
        return adminCatalogApi.updateTopic(subjectId, editingTopic.id, values);
      }
      return adminCatalogApi.createTopic(subjectId, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-topics', subjectId]);
      toast.success(editingTopic ? 'Topic updated' : 'Topic created');
      setModalOpen(false);
      setEditingTopic(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error saving topic');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (topicId) => adminCatalogApi.deleteTopic(subjectId, topicId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-topics', subjectId]);
      toast.success('Topic deleted');
      setDeletingId(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete topic');
    },
  });

  const handleOpenCreate = () => {
    setEditingTopic(null);
    form.reset({ name: '', slug: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (topic) => {
    setEditingTopic(topic);
    form.reset({
      name: topic.name,
      slug: topic.slug || '',
    });
    setModalOpen(true);
  };

  const columns = [
    { key: 'id', header: 'ID', className: 'w-16 font-mono text-xs' },
    { key: 'name', header: 'Topic Name', className: 'font-medium' },
    { key: 'slug', header: 'Slug', className: 'font-mono text-xs text-muted-foreground' },
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
          <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs text-muted-foreground mb-2">
            <Link to="/admin/exams">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Exams
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Subject Topics</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Sub-topics for granular syllabus mapping under Subject #{subjectId}
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Topic
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={topics}
        loading={isLoading}
        emptyMessage="No sub-topics added for this subject yet."
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTopic ? 'Edit Topic' : 'Add Topic'}</DialogTitle>
            <DialogDescription>Define sub-topic chapter or module title</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit((vals) => saveMutation.mutate(vals))} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Percentage & Ratio" {...field} />
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
                      <Input placeholder="e.g. percentage-ratio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-4">
                <Button type="submit" disabled={saveMutation.isPending}>
                  {editingTopic ? 'Save Changes' : 'Create Topic'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(op) => !op && setDeletingId(null)}
        title="Delete Topic?"
        description="This will permanently delete the topic."
        onConfirm={() => deleteMutation.mutate(deletingId)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}