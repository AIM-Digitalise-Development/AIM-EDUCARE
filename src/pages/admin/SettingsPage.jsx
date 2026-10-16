import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSettingsApi } from '@/api/admin/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Save, Settings2, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const res = await adminSettingsApi.getSettings();
      return res.data?.data || {};
    },
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: (payload) => adminSettingsApi.updateSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-settings']);
      toast.success('System settings updated successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update settings');
    },
  });

  const handleChange = (key, val) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading system settings..." />;
  }

  const keys = Object.keys(formData);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System & Integration Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage platform parameters, gateway configurations, and Nexbotix WhatsApp API hooks
        </p>
      </div>

      <form onSubmit={handleSave}>
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Key-Value Configuration Registry</CardTitle>
            <CardDescription>
              Settings are synchronized across all running instances in real time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {keys.length === 0 ? (
              <p className="text-sm text-muted-foreground">No configuration keys found.</p>
            ) : (
              keys.map((key) => {
                const val = formData[key];
                const isObject = typeof val === 'object' && val !== null;

                return (
                  <div key={key} className="space-y-1.5 p-3 rounded-lg border bg-muted/20">
                    <label className="font-mono text-xs font-semibold text-foreground">
                      {key}
                    </label>
                    {isObject ? (
                      <Textarea
                        rows={3}
                        value={JSON.stringify(val, null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            handleChange(key, parsed);
                          } catch {
                            // keep raw if typing
                          }
                        }}
                        className="font-mono text-xs"
                      />
                    ) : (
                      <Input
                        value={String(val ?? '')}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="text-xs"
                      />
                    )}
                  </div>
                );
              })
            )}
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button type="submit" disabled={updateMutation.isPending} className="gap-2">
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Settings...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}