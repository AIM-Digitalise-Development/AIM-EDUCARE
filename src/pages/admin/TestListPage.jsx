import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminTestsApi } from '@/api/admin/tests';
import { adminCatalogApi } from '@/api/admin/catalog';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Settings2, Trash2, Clock, Award } from 'lucide-react';
import { toast } from 'sonner';

export default function TestListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [formExamId, setFormExamId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState('full_mock');
  const [formDurationMinutes, setFormDurationMinutes] = useState(60);

  const { data: exams } = useQuery({
    queryKey: ['admin-exams-dropdown'],
    queryFn: async () => {
      const res = await adminCatalogApi.getExams();
      return res.data?.data?.items || res.data?.data || [];
    },
  });

  const { data: tests, isLoading } = useQuery({
    queryKey: ['admin-tests'],
    queryFn: async () => {
      const res = await adminTestsApi.getTests();
      return res.data?.data?.items || res.data?.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      return adminTestsApi.createTest(payload);
    },
    onSuccess: (res) => {
      const newTest = res.data?.data;
      toast.success('Test created! Opening test builder...');
      setCreateModalOpen(false);
      navigate(`/admin/tests/${newTest.id}/builder`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error creating test');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminTestsApi.deleteTest(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-tests']);
      toast.success('Test deleted');
      setDeletingId(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete test');
    },
  });

  const handleCreateTest = (e) => {
    e.preventDefault();
    if (!formExamId) return toast.error('Please choose an exam');
    if (!formTitle.trim()) return toast.error('Please enter a test title');

    createMutation.mutate({
      exam_id: parseInt(formExamId, 10),
      title: formTitle,
      type: formType,
      total_duration_sec: formDurationMinutes * 60,
      default_marks: 1,
      default_negative: 0.25,
      sections_enabled: false,
      result_visibility: 'full',
      status: 'draft',
    });
  };

  const columns = [
    { key: 'id', header: 'ID', className: 'w-16 font-mono text-xs' },
    { key: 'title', header: 'Test Title', className: 'font-semibold text-sm' },
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
          {row.type?.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'duration',
      header: 'Duration',
      className: 'text-xs',
      render: (row) => `${Math.round((row.total_duration_sec || 0) / 60)} min`,
    },
    {
      key: 'status',
      header: 'Status',
      className: 'w-24',
      render: (row) => (
        <Badge
          variant={row.status === 'published' ? 'secondary' : 'outline'}
          className={`capitalize text-[11px] ${
            row.status === 'published' ? 'text-emerald-600 bg-emerald-500/10' : 'text-muted-foreground'
          }`}
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'w-28 text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" asChild title="Open Test Builder" className="h-8 w-8">
            <Link to={`/admin/tests/${row.id}/builder`}>
              <Settings2 className="h-3.5 w-3.5 text-primary" />
            </Link>
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
          <h1 className="text-3xl font-bold tracking-tight">Mock Tests Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Build, publish, and schedule mock exams, sectional tests, and live simulations
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Test
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={tests}
        loading={isLoading}
        emptyMessage="No tests created yet. Click 'Create New Test' to start building."
      />

      {/* Create Dialog */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Mock Test</DialogTitle>
            <DialogDescription>Define initial parameters then construct sections and questions</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTest} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold">Target Exam</label>
              <Select value={formExamId} onValueChange={setFormExamId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Exam" />
                </SelectTrigger>
                <SelectContent>
                  {(exams || []).map((e) => (
                    <SelectItem key={e.id} value={String(e.id)}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold">Test Title</label>
              <Input
                placeholder="e.g. SBI PO Prelims Mock #1"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold">Test Type</label>
                <Select value={formType} onValueChange={setFormType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_mock">Full Mock</SelectItem>
                    <SelectItem value="sectional">Sectional</SelectItem>
                    <SelectItem value="pyq">PYQ</SelectItem>
                    <SelectItem value="live">Live Exam</SelectItem>
                    <SelectItem value="topic">Topic Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold">Duration (Minutes)</label>
                <Input
                  type="number"
                  min="1"
                  value={formDurationMinutes}
                  onChange={(e) => setFormDurationMinutes(parseInt(e.target.value, 10))}
                  className="mt-1"
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button type="submit" disabled={createMutation.isPending}>
                Create & Open Builder
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(op) => !op && setDeletingId(null)}
        title="Delete Mock Test?"
        description="This will permanently delete the test, section layout, and candidate attempts."
        onConfirm={() => deleteMutation.mutate(deletingId)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}