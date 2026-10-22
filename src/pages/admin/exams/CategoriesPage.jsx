import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { examCategorySchema } from '@/lib/validators';
import { adminCatalogApi } from '@/api/admin/catalog';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
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
import { Plus, Edit2, Trash2, FolderTree } from 'lucide-react';
import { toast } from 'sonner';

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await adminCatalogApi.getCategories();
      const raw = res.data?.data ?? res.data;
      if (Array.isArray(raw)) return raw;
      if (Array.isArray(raw?.items)) return raw.items;
      if (Array.isArray(raw?.data)) return raw.data;
      return [];
    },
  });

  const form = useForm({
    resolver: zodResolver(examCategorySchema),
    defaultValues: {
      name: '',
      slug: '',
      sort_order: 0,
      is_active: true,
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (values) => {
      if (editingCategory) {
        return adminCatalogApi.updateCategory(editingCategory.id, values);
      }
      return adminCatalogApi.createCategory(values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-categories']);
      toast.success(editingCategory ? 'Category updated' : 'Category created');
      setModalOpen(false);
      setEditingCategory(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error saving category');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminCatalogApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-categories']);
      toast.success('Category deleted');
      setDeletingId(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    },
  });

  const handleOpenCreate = () => {
    setEditingCategory(null);
    form.reset({ name: '', slug: '', sort_order: 0, is_active: true });
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    form.reset({
      name: cat.name,
      slug: cat.slug || '',
      sort_order: cat.sort_order || 0,
      is_active: Boolean(cat.is_active),
    });
    setModalOpen(true);
  };

  const columns = [
    { key: 'id', header: 'ID', className: 'w-16 font-mono text-xs' },
    { key: 'name', header: 'Name', className: 'font-medium' },
    { key: 'slug', header: 'Slug', className: 'text-muted-foreground font-mono text-xs' },
    { key: 'sort_order', header: 'Sort Order', className: 'w-24 text-center' },
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
      className: 'w-28 text-right',
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
          <h1 className="text-3xl font-bold tracking-tight">Exam Categories</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage top-level exam streams and classification categories
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        loading={isLoading}
        emptyMessage="No exam categories configured yet."
      />

      {/* Modal Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
            <DialogDescription>Define category title and ordering</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit((vals) => saveMutation.mutate(vals))} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Banking & Insurance" {...field} />
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
                      <Input placeholder="e.g. banking-insurance" {...field} />
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
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(op) => !op && setDeletingId(null)}
        title="Delete Exam Category?"
        description="This category and its associations will be permanently removed."
        onConfirm={() => deleteMutation.mutate(deletingId)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}