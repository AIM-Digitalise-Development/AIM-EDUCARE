// import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminTestsApi } from '@/api/admin/tests';
import { adminQuestionsApi } from '@/api/admin/questions';
import { adminCatalogApi } from '@/api/admin/catalog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { ArrowLeft, Save, Globe, Calendar, Plus, Trash2, CheckCircle2, Info, Layers, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function TestBuilderPage() {
  const { testId } = useParams();
  const queryClient = useQueryClient();

  // Test details query
  const { data: test, isLoading } = useQuery({
    queryKey: ['admin-test-detail', testId],
    queryFn: async () => {
      const res = await adminTestsApi.getTest(testId);
      return res.data?.data;
    },
  });

  // Metadata tab state
  const [title, setTitle] = useState('');
  const [type, setType] = useState('full_mock');
  const [durationMin, setDurationMin] = useState(60);
  const [defaultMarks, setDefaultMarks] = useState(1);
  const [defaultNegative, setDefaultNegative] = useState(0.25);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [shuffleOptions, setShuffleOptions] = useState(false);
  const [negativeMarking, setNegativeMarking] = useState(true);
  const [sectionsEnabled, setSectionsEnabled] = useState(false);
  const [resultVisibility, setResultVisibility] = useState('full');
  const [activeTab, setActiveTab] = useState('metadata');

  // Sync test query to state
  useEffect(() => {
    if (test) {
      setTitle(test.title || '');
      setType(test.type || 'full_mock');
      setDurationMin(Math.round((test.total_duration_sec || 0) / 60));
      setDefaultMarks(test.default_marks || 1);
      setDefaultNegative(test.default_negative || 0.25);
      setShuffleQuestions(Boolean(test.shuffle_questions));
      setShuffleOptions(Boolean(test.shuffle_options));
      setNegativeMarking(Boolean(test.negative_marking_enabled));
      setSectionsEnabled(Boolean(test.sections_enabled));
      setResultVisibility(test.result_visibility || 'full');
    }
  }, [test]);

  // Section modal state
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [sectionName, setSectionName] = useState('');
  const [sectionDurationMin, setSectionDurationMin] = useState('');
  const [sectionMarks, setSectionMarks] = useState(1);
  const [sectionNegative, setSectionNegative] = useState(0.25);

  // Live schedule modal state
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [liveStart, setLiveStart] = useState('');
  const [liveEnd, setLiveEnd] = useState('');

  // Questions picker state
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [selectedQids, setSelectedQids] = useState([]);
  const [targetSectionId, setTargetSectionId] = useState('');

  const { data: bankQuestions, isLoading: loadingBank } = useQuery({
    queryKey: ['admin-questions-picker', test?.exam_id, filterDifficulty],
    queryFn: async () => {
      if (!test?.exam_id) return [];
      const params = { exam_id: test.exam_id };
      if (filterDifficulty) params.difficulty = filterDifficulty;
      const res = await adminQuestionsApi.getQuestions(params);
      return res.data?.data?.items || res.data?.data || [];
    },
    enabled: !!test?.exam_id,
  });

  // Mutations
  const updateMetaMutation = useMutation({
    mutationFn: (payload) => adminTestsApi.updateTest(testId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-test-detail', testId] });
      queryClient.invalidateQueries({ queryKey: ['admin-tests'] });
      toast.success('Test configuration saved successfully');
      if (sectionsEnabled) {
        setActiveTab('sections');
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error updating metadata');
    },
  });

  const publishMutation = useMutation({
    mutationFn: () => adminTestsApi.publishTest(testId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-test-detail', testId] });
      queryClient.invalidateQueries({ queryKey: ['admin-tests'] });
      toast.success('Test published successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to publish test');
    },
  });

  const scheduleLiveMutation = useMutation({
    mutationFn: (payload) => adminTestsApi.scheduleLive(testId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-test-detail', testId] });
      queryClient.invalidateQueries({ queryKey: ['admin-tests'] });
      toast.success('Live test scheduled successfully!');
      setScheduleModalOpen(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to schedule live test');
    },
  });

  const addSectionMutation = useMutation({
    mutationFn: (payload) => adminTestsApi.addSection(testId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-test-detail', testId] });
      queryClient.invalidateQueries({ queryKey: ['admin-tests'] });
      toast.success('Section added');
      setSectionModalOpen(false);
      setSectionName('');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error adding section');
    },
  });

  const addQuestionsMutation = useMutation({
    mutationFn: (payload) => adminTestsApi.addQuestions(testId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-test-detail', testId] });
      queryClient.invalidateQueries({ queryKey: ['admin-tests'] });
      toast.success('Questions attached to test');
      setSelectedQids([]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error attaching questions');
    },
  });

  const removeQuestionMutation = useMutation({
    mutationFn: (qid) => adminTestsApi.removeQuestion(testId, qid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-test-detail', testId] });
      queryClient.invalidateQueries({ queryKey: ['admin-tests'] });
      toast.success('Question removed');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Error removing question');
    },
  });

  const handleSaveMetadata = (e) => {
    e.preventDefault();
    updateMetaMutation.mutate({
      exam_id: test.exam_id,
      title,
      type,
      total_duration_sec: durationMin * 60,
      default_marks: parseFloat(defaultMarks),
      default_negative: parseFloat(defaultNegative),
      shuffle_questions: shuffleQuestions,
      shuffle_options: shuffleOptions,
      negative_marking_enabled: negativeMarking,
      sections_enabled: sectionsEnabled,
      result_visibility: resultVisibility,
    });
  };

  const handleAddSectionSubmit = (e) => {
    e.preventDefault();
    if (!sectionName.trim()) return toast.error('Section name is required');
    addSectionMutation.mutate({
      name: sectionName,
      sort_order: (test.sections?.length || 0) + 1,
      duration_sec: sectionDurationMin ? parseInt(sectionDurationMin, 10) * 60 : null,
      marks_per_q: parseFloat(sectionMarks),
      negative_marks: parseFloat(sectionNegative),
    });
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!liveStart || !liveEnd) return toast.error('Start and End dates are required');
    scheduleLiveMutation.mutate({
      live_start_at: liveStart,
      live_end_at: liveEnd,
    });
  };

  const handleAddSelectedQuestions = () => {
    if (selectedQids.length === 0) return toast.error('Select at least one question');
    addQuestionsMutation.mutate({
      question_ids: selectedQids,
      section_id: targetSectionId ? parseInt(targetSectionId, 10) : null,
    });
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading test builder..." />;
  }

  if (!test) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Test not found</h2>
        <Button asChild className="mt-4">
          <Link to="/admin/tests">Back to Tests</Link>
        </Button>
      </div>
    );
  }

  const attachedTestQuestions = test.test_questions || test.testQuestions || [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="gap-1.5 text-xs text-muted-foreground mb-1">
            <Link to="/admin/tests">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Test List
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{test.title}</h1>
            <Badge variant={test.status === 'published' ? 'secondary' : 'outline'} className="capitalize text-xs">
              {test.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScheduleModalOpen(true)}
            className="gap-1.5 text-xs"
          >
            <Calendar className="h-4 w-4" />
            Schedule Live
          </Button>
          <Button
            size="sm"
            onClick={() => publishMutation.mutate()}
            disabled={publishMutation.isPending || test.status === 'published'}
            className="gap-1.5 text-xs"
          >
            <Globe className="h-4 w-4" />
            {test.status === 'published' ? 'Published' : 'Publish Test'}
          </Button>
        </div>
      </div>

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div>
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="metadata">1. Settings</TabsTrigger>
            <TabsTrigger value="sections" className="flex items-center gap-1.5">
              2. Sections {sectionsEnabled ? `(${test.sections?.length || 0})` : ''}
              {!sectionsEnabled && <Lock className="h-3 w-3 opacity-60 ml-0.5" />}
            </TabsTrigger>
            <TabsTrigger value="questions">
              3. Questions ({attachedTestQuestions.length})
            </TabsTrigger>
          </TabsList>
          {!sectionsEnabled && (
            <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1.5 flex items-center gap-1 font-medium">
              <Info className="h-3.5 w-3.5 shrink-0" />
              Enable sectional structure in Settings tab first to configure timed sections.
            </p>
          )}
        </div>

        {/* Tab 1: Metadata */}
        <TabsContent value="metadata">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Test Configuration & Scoring</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveMetadata} className="space-y-4 max-w-2xl">
                <div>
                  <label className="text-xs font-semibold">Test Title</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold">Test Type</label>
                    <Select value={type} onValueChange={setType}>
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
                    <label className="text-xs font-semibold">Total Duration (Minutes)</label>
                    <Input
                      type="number"
                      value={durationMin}
                      onChange={(e) => setDurationMin(parseInt(e.target.value, 10))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold">Default Marks per Question</label>
                    <Input
                      type="number"
                      step="any"
                      value={defaultMarks}
                      onChange={(e) => setDefaultMarks(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold">Default Negative Marking</label>
                    <Input
                      type="number"
                      step="any"
                      value={defaultNegative}
                      onChange={(e) => setDefaultNegative(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold">Result Visibility for Candidates</label>
                  <Select value={resultVisibility} onValueChange={setResultVisibility}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full (Score, Percentile & Question Review)</SelectItem>
                      <SelectItem value="marks_only">Marks Only (Score & Percentage)</SelectItem>
                      <SelectItem value="hidden">Hidden (Closed evaluation)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Switches */}
                <div className="space-y-3 pt-3 border-t">
                  <div className="flex items-center justify-between rounded-lg border p-3.5 bg-card">
                    <div>
                      <div className="text-sm font-semibold text-foreground">Enable Sectional Structure</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Adds a Sections tab where you can group questions under timed sections with custom marks and cutoffs.
                      </div>
                    </div>
                    <Switch checked={sectionsEnabled} onCheckedChange={setSectionsEnabled} />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <div className="text-sm font-medium">Shuffle Questions</div>
                      <div className="text-xs text-muted-foreground">Randomize question order for each attempt</div>
                    </div>
                    <Switch checked={shuffleQuestions} onCheckedChange={setShuffleQuestions} />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <div className="text-sm font-medium">Shuffle Options</div>
                      <div className="text-xs text-muted-foreground">Randomize MCQ options order</div>
                    </div>
                    <Switch checked={shuffleOptions} onCheckedChange={setShuffleOptions} />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <div className="text-sm font-medium">Negative Marking Active</div>
                      <div className="text-xs text-muted-foreground">Deduct marks for incorrect answers</div>
                    </div>
                    <Switch checked={negativeMarking} onCheckedChange={setNegativeMarking} />
                  </div>
                </div>

                <Button type="submit" disabled={updateMetaMutation.isPending} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Sections */}
        <TabsContent value="sections">
          {!sectionsEnabled ? (
            <Card className="border-amber-200 bg-amber-50/40 dark:bg-amber-950/20">
              <CardContent className="p-8 sm:p-12 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300">
                  <Layers className="h-6 w-6" />
                </div>
                <div className="max-w-md mx-auto space-y-1.5">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Sectional Structure is Disabled
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    This test is not configured for sections. Enable "Sectional Structure" in the Settings tab to add timed sections with individual marks and cutoffs.
                  </p>
                </div>
                <Button
                  onClick={() => setActiveTab('metadata')}
                  className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm"
                >
                  Go to Settings
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Sectional Breakdown</CardTitle>
                <Button size="sm" onClick={() => setSectionModalOpen(true)} className="gap-1.5 text-xs">
                  <Plus className="h-4 w-4" />
                  Add Section
                </Button>
              </CardHeader>
              <CardContent>
                {!test.sections || test.sections.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No sections created yet. Add section domains to group questions.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {test.sections.map((sec) => (
                      <div key={sec.id} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                        <div>
                          <div className="font-semibold text-sm">{sec.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Marks/Q: +{sec.marks_per_q} | Negative: -{sec.negative_marks} |{' '}
                            {sec.duration_sec ? `${Math.round(sec.duration_sec / 60)} min` : 'No time limit'}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Section #{sec.sort_order}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab 3: Questions Builder */}
        <TabsContent value="questions">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Question Bank Picker */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Available Questions</CardTitle>
                  <Button
                    size="sm"
                    onClick={handleAddSelectedQuestions}
                    disabled={selectedQids.length === 0 || addQuestionsMutation.isPending}
                    className="gap-1 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Selected ({selectedQids.length})
                  </Button>
                </div>
                {sectionsEnabled && test.sections?.length > 0 && (
                  <div className="pt-2">
                    <Select value={targetSectionId} onValueChange={setTargetSectionId}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Target Section (Optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=" ">No Section</SelectItem>
                        {test.sections.map((s) => (
                          <SelectItem key={s.id} value={String(s.id)}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
                {loadingBank ? (
                  <LoadingSpinner text="Loading questions..." />
                ) : !bankQuestions || bankQuestions.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">
                    No questions available in question bank for this exam.
                  </p>
                ) : (
                  bankQuestions.map((bq) => {
                    const isChecked = selectedQids.includes(bq.id);
                    return (
                      <div
                        key={bq.id}
                        onClick={() => {
                          if (isChecked) {
                            setSelectedQids((prev) => prev.filter((id) => id !== bq.id));
                          } else {
                            setSelectedQids((prev) => [...prev, bq.id]);
                          }
                        }}
                        className={`flex items-start gap-2.5 p-2.5 rounded border text-xs cursor-pointer transition-colors ${
                          isChecked ? 'border-primary bg-primary/5' : 'hover:bg-muted/30'
                        }`}
                      >
                        <Checkbox checked={isChecked} className="mt-0.5" />
                        <div className="flex-1">
                          <div className="line-clamp-2 text-foreground font-medium">{bq.question_text}</div>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                            <span className="capitalize">{bq.type?.replace('_', ' ')}</span>
                            <span>•</span>
                            <span className="capitalize">{bq.difficulty}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Right: Attached Questions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                  Test Questions ({attachedTestQuestions.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
                {attachedTestQuestions.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">
                    No questions attached to this test yet. Select items from the bank on the left.
                  </p>
                ) : (
                  attachedTestQuestions.map((tq, idx) => {
                    const q = tq.question || tq;
                    return (
                      <div
                        key={q.id || idx}
                        className="flex items-start justify-between gap-3 p-2.5 rounded border text-xs bg-muted/20"
                      >
                        <div className="flex-1">
                          <div className="font-semibold text-foreground mb-0.5">
                            #{idx + 1}. {q.question_text}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span className="capitalize">{q.type?.replace('_', ' ')}</span>
                            {tq.section_id && <span>• Section #{tq.section_id}</span>}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeQuestionMutation.mutate(q.id)}
                          className="h-7 w-7 text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Section Dialog */}
      <Dialog open={sectionModalOpen} onOpenChange={setSectionModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Test Section</DialogTitle>
            <DialogDescription>Define sectional scoring rules and time allocation</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSectionSubmit} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold">Section Name</label>
              <Input
                placeholder="e.g. Reasoning Ability"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold">Marks per Question</label>
                <Input
                  type="number"
                  step="any"
                  value={sectionMarks}
                  onChange={(e) => setSectionMarks(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold">Negative Marks</label>
                <Input
                  type="number"
                  step="any"
                  value={sectionNegative}
                  onChange={(e) => setSectionNegative(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold">Duration in Minutes (Optional)</label>
              <Input
                type="number"
                placeholder="Leave blank for shared timer"
                value={sectionDurationMin}
                onChange={(e) => setSectionDurationMin(e.target.value)}
                className="mt-1"
              />
            </div>

            <DialogFooter className="mt-4">
              <Button type="submit" disabled={addSectionMutation.isPending}>
                Add Section
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Schedule Live Dialog */}
      <Dialog open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Live Mock Test</DialogTitle>
            <DialogDescription>Candidates can only attempt within this designated window</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleScheduleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold">Live Start Time</label>
              <Input
                type="datetime-local"
                value={liveStart}
                onChange={(e) => setLiveStart(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold">Live End Time</label>
              <Input
                type="datetime-local"
                value={liveEnd}
                onChange={(e) => setLiveEnd(e.target.value)}
                className="mt-1"
              />
            </div>

            <DialogFooter className="mt-4">
              <Button type="submit" disabled={scheduleLiveMutation.isPending}>
                Confirm Live Schedule
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}