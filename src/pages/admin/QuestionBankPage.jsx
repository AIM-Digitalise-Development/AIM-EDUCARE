import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminQuestionsApi } from '@/api/admin/questions';
import { adminCatalogApi } from '@/api/admin/catalog';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Plus, Upload, Trash2, Edit2, Search, Download, FileSpreadsheet, GraduationCap, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function QuestionBankPage() {
  const queryClient = useQueryClient();
  const [filterExam, setFilterExam] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [search, setSearch] = useState('');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Form states
  const [formExamId, setFormExamId] = useState('');
  const [formType, setFormType] = useState('single_mcq');
  const [formDifficulty, setFormDifficulty] = useState('medium');
  const [formQuestionText, setFormQuestionText] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formExplanation, setFormExplanation] = useState('');
  const [formNumericalAnswer, setFormNumericalAnswer] = useState('');
  const [formOptions, setFormOptions] = useState([
    { option_key: 'A', option_text: '', is_correct: false },
    { option_key: 'B', option_text: '', is_correct: false },
    { option_key: 'C', option_text: '', is_correct: false },
    { option_key: 'D', option_text: '', is_correct: false },
  ]);

  // Bulk state
  const [bulkExamId, setBulkExamId] = useState('');
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkUploading, setBulkUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [attachingSample, setAttachingSample] = useState(false);

  const handleAttachDummyCsv = async () => {
    setAttachingSample(true);
    try {
      const response = await fetch('/questions_sample_50.csv');
      if (!response.ok) throw new Error('File not found');
      const blob = await response.blob();
      const file = new File([blob], 'questions_sample_50.csv', { type: 'text/csv' });
      setBulkFile(file);

      try {
        const dt = new DataTransfer();
        dt.items.add(file);
        if (fileInputRef.current) {
          fileInputRef.current.files = dt.files;
        }
      } catch (_) {
        // Fallback for browsers
      }
      toast.success('Attached questions_sample_50.csv (50 questions)');
    } catch (err) {
      toast.error('Failed to attach sample CSV');
    } finally {
      setAttachingSample(false);
    }
  };

  const { data: exams } = useQuery({
    queryKey: ['admin-exams-dropdown'],
    queryFn: async () => {
      const res = await adminCatalogApi.getExams({ all: true, per_page: 100 });
      return res.data?.data?.items || res.data?.data || [];
    },
  });

  const { data: questionsData, isLoading } = useQuery({
    queryKey: ['admin-questions', { filterExam, filterType, filterDifficulty, search }],
    queryFn: async () => {
      const params = {};
      if (filterExam) params.exam_id = filterExam;
      if (filterType) params.type = filterType;
      if (filterDifficulty) params.difficulty = filterDifficulty;
      if (search) params.search = search;
      const res = await adminQuestionsApi.getQuestions(params);
      return res.data?.data?.items || res.data?.data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingQuestion) {
        return adminQuestionsApi.updateQuestion(editingQuestion.id, payload);
      }
      return adminQuestionsApi.createQuestion(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-questions']);
      toast.success(editingQuestion ? 'Question updated' : 'Question created');
      setCreateModalOpen(false);
      setEditingQuestion(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error saving question');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminQuestionsApi.deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-questions']);
      toast.success('Question deleted');
      setDeletingId(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete question');
    },
  });

  const handleOpenCreate = () => {
    setEditingQuestion(null);
    setFormExamId(exams?.[0]?.id ? String(exams[0].id) : '');
    setFormType('single_mcq');
    setFormDifficulty('medium');
    setFormQuestionText('');
    setFormImageUrl('');
    setFormExplanation('');
    setFormNumericalAnswer('');
    setFormOptions([
      { option_key: 'A', option_text: '', is_correct: false },
      { option_key: 'B', option_text: '', is_correct: false },
      { option_key: 'C', option_text: '', is_correct: false },
      { option_key: 'D', option_text: '', is_correct: false },
    ]);
    setCreateModalOpen(true);
  };

  const handleOpenEdit = (q) => {
    setEditingQuestion(q);
    const targetExamId = q.exam_id || q.exam?.id || '';
    setFormExamId(targetExamId ? String(targetExamId) : '');
    setFormType(q.type);
    setFormDifficulty(q.difficulty);
    setFormQuestionText(q.question_text || '');
    setFormImageUrl(q.question_image_url || '');
    setFormExplanation(q.explanation_text || '');
    if (q.type === 'numerical') {
      setFormNumericalAnswer(String(q.correct_answer || ''));
    } else {
      setFormOptions(
        (q.options || []).map((o) => ({
          option_key: o.option_key,
          option_text: o.option_text || '',
          is_correct: Boolean(o.is_correct),
        }))
      );
    }
    setCreateModalOpen(true);
  };

  const handleSaveQuestion = (e) => {
    e.preventDefault();
    if (!formExamId) return toast.error('Please select an exam');
    if (!formQuestionText.trim()) return toast.error('Question text is required');

    let correctAnswer = null;
    let optionsPayload = [];

    if (formType === 'numerical') {
      if (!formNumericalAnswer) return toast.error('Numerical correct answer is required');
      correctAnswer = parseFloat(formNumericalAnswer);
    } else {
      const correctOpts = formOptions.filter((o) => o.is_correct).map((o) => o.option_key);
      if (correctOpts.length === 0) return toast.error('Please mark at least one correct option');
      correctAnswer = formType === 'multi_mcq' ? correctOpts : correctOpts[0];
      optionsPayload = formOptions.map((o) => ({
        option_key: o.option_key,
        option_text: o.option_text,
        is_correct: o.is_correct,
      }));
    }

    saveMutation.mutate({
      exam_id: parseInt(formExamId, 10),
      type: formType,
      difficulty: formDifficulty,
      question_text: formQuestionText,
      question_image_url: formImageUrl || null,
      explanation_text: formExplanation || null,
      correct_answer: correctAnswer,
      options: optionsPayload,
    });
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!bulkExamId) return toast.error('Please choose target exam');
    if (!bulkFile) return toast.error('Please attach a CSV file');

    setBulkUploading(true);
    try {
      const formData = new FormData();
      formData.append('exam_id', bulkExamId);
      formData.append('file', bulkFile);
      const res = await adminQuestionsApi.bulkUpload(formData);
      toast.success(res.data?.message || 'Bulk upload complete!');
      queryClient.invalidateQueries(['admin-questions']);
      setBulkModalOpen(false);
      setBulkFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bulk upload failed');
    } finally {
      setBulkUploading(false);
    }
  };

  const columns = [
    { key: 'id', header: 'ID', className: 'w-16 font-mono text-xs' },
    {
      key: 'question_text',
      header: 'Question',
      render: (row) => (
        <div className="line-clamp-2 max-w-md text-xs leading-relaxed">
          {row.question_text}
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      className: 'w-28 capitalize text-xs',
      render: (row) => (
        <Badge variant="outline" className="font-normal text-[11px]">
          {row.type?.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'difficulty',
      header: 'Difficulty',
      className: 'w-24 capitalize text-xs',
      render: (row) => (
        <Badge
          variant="secondary"
          className={`text-[10px] font-semibold ${
            row.difficulty === 'easy'
              ? 'text-emerald-600 bg-emerald-500/10'
              : row.difficulty === 'hard'
              ? 'text-destructive bg-destructive/10'
              : 'text-amber-600 bg-amber-500/10'
          }`}
        >
          {row.difficulty}
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
          <h1 className="text-3xl font-bold tracking-tight">Question Bank</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage high-yield competitive exam items, diagrams, and solution keys
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setBulkModalOpen(true)} className="gap-2">
            <Upload className="h-4 w-4" />
            Bulk CSV Upload
          </Button>
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-card p-4 rounded-xl border">
        <div>
          <Select value={filterExam} onValueChange={setFilterExam}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="All Exams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">All Exams</SelectItem>
              {(exams || []).map((e) => (
                <SelectItem key={e.id} value={String(e.id)}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">All Types</SelectItem>
              <SelectItem value="single_mcq">Single MCQ</SelectItem>
              <SelectItem value="multi_mcq">Multi MCQ</SelectItem>
              <SelectItem value="numerical">Numerical</SelectItem>
              <SelectItem value="true_false">True / False</SelectItem>
              <SelectItem value="assertion_reason">Assertion Reason</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="All Difficulties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-xs"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={questionsData}
        loading={isLoading}
        emptyMessage="No questions match the current filters."
      />

      {/* Create / Edit Dialog */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingQuestion ? 'Edit Question' : 'Create New Question'}</DialogTitle>
            <DialogDescription>Input question formulation, type, and answer key</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveQuestion} className="space-y-4 pt-2">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold">Exam</label>
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
                <label className="text-xs font-semibold">Question Type</label>
                <Select value={formType} onValueChange={setFormType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single_mcq">Single MCQ</SelectItem>
                    <SelectItem value="multi_mcq">Multi MCQ</SelectItem>
                    <SelectItem value="numerical">Numerical</SelectItem>
                    <SelectItem value="true_false">True / False</SelectItem>
                    <SelectItem value="assertion_reason">Assertion Reason</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold">Difficulty</label>
                <Select value={formDifficulty} onValueChange={setFormDifficulty}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold">Question Text</label>
              <Textarea
                placeholder="Enter question body..."
                value={formQuestionText}
                onChange={(e) => setFormQuestionText(e.target.value)}
                className="mt-1 min-h-[90px]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold">Diagram / Image URL (Optional)</label>
              <Input
                placeholder="https://..."
                value={formImageUrl}
                onChange={(e) => setFormImageUrl(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Answer Options Section */}
            {formType === 'numerical' ? (
              <div className="p-4 rounded-lg bg-muted/40 space-y-2">
                <label className="text-xs font-semibold">Correct Numerical Value</label>
                <Input
                  type="number"
                  step="any"
                  placeholder="e.g. 24.5"
                  value={formNumericalAnswer}
                  onChange={(e) => setFormNumericalAnswer(e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-2 border-t pt-3">
                <div className="text-xs font-semibold flex justify-between items-center">
                  <span>Options & Correct Answer Key</span>
                  <span className="text-[11px] text-muted-foreground font-normal">
                    Check the box next to correct choice(s)
                  </span>
                </div>
                {formOptions.map((opt, idx) => (
                  <div key={opt.option_key} className="flex items-center gap-2">
                    <Checkbox
                      checked={opt.is_correct}
                      onCheckedChange={(checked) => {
                        const next = [...formOptions];
                        if (formType === 'single_mcq' || formType === 'assertion_reason' || formType === 'true_false') {
                          next.forEach((o, i) => (o.is_correct = i === idx ? checked : false));
                        } else {
                          next[idx].is_correct = checked;
                        }
                        setFormOptions(next);
                      }}
                    />
                    <span className="font-bold text-xs w-4">{opt.option_key}</span>
                    <Input
                      placeholder={`Option ${opt.option_key} text...`}
                      value={opt.option_text}
                      onChange={(e) => {
                        const next = [...formOptions];
                        next[idx].option_text = e.target.value;
                        setFormOptions(next);
                      }}
                      className="h-8 text-xs"
                    />
                  </div>
                ))}
              </div>
            )}

            <div>
              <label className="text-xs font-semibold">Explanation Text</label>
              <Textarea
                placeholder="Detailed rationale and mathematical derivation..."
                value={formExplanation}
                onChange={(e) => setFormExplanation(e.target.value)}
                className="mt-1 min-h-[70px]"
              />
            </div>

            <DialogFooter className="mt-4">
              <Button type="submit" disabled={saveMutation.isPending}>
                {editingQuestion ? 'Update Question' : 'Save to Bank'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <Dialog open={bulkModalOpen} onOpenChange={setBulkModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk CSV Upload</DialogTitle>
            <DialogDescription>Upload questions batch formatted as CSV</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBulkUpload} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold">Target Exam</label>
              <Select value={bulkExamId} onValueChange={setBulkExamId}>
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
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold">Select CSV File</label>
                <a
                  href="/questions_sample_50.csv"
                  download="questions_sample_50.csv"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Sample CSV
                </a>
              </div>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={(e) => setBulkFile(e.target.files?.[0] || null)}
                className="mt-1"
              />

              {/* Sample file attach card */}
              <div className="mt-2.5 p-3 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/50 rounded-lg">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        Dummy Example CSV (50 Questions)
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                        Pre-formatted with 35 MCQs, 10 Numerical, and 5 True/False questions.
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAttachDummyCsv}
                    disabled={attachingSample}
                    className="shrink-0 h-7 text-xs bg-white dark:bg-slate-900 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800"
                  >
                    {attachingSample ? 'Attaching...' : 'Attach Sample'}
                  </Button>
                </div>
                {bulkFile && (
                  <div className="mt-2 pt-2 border-t border-blue-200/50 dark:border-blue-900/30 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400">
                    <span className="truncate">Attached: <strong>{bulkFile.name}</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        setBulkFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-[11px] text-muted-foreground hover:text-red-600 underline ml-2"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              <p className="text-[10px] text-muted-foreground mt-2 font-mono leading-tight">
                CSV headers: type, difficulty, subject, topic, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation_text
              </p>
            </div>

            <DialogFooter className="mt-4">
              <Button type="submit" disabled={bulkUploading}>
                {bulkUploading ? 'Importing CSV...' : 'Start Import'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(op) => !op && setDeletingId(null)}
        title="Delete Question?"
        description="This question will be removed from all future tests."
        onConfirm={() => deleteMutation.mutate(deletingId)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}