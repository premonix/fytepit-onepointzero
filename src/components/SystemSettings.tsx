import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';
import { Settings, Save, RotateCcw } from 'lucide-react';

interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description: string;
  category: string;
  is_public: boolean;
}

export function SystemSettings() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { isSuperAdmin } = useUserRole();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('category', { ascending: true });
      
      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch system settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async (settingKey: string, newValue: any) => {
    if (!isSuperAdmin()) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({ 
          setting_value: newValue,
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', settingKey);

      if (error) throw error;

      // Update local state
      setSettings(prev => prev.map(setting => 
        setting.setting_key === settingKey 
          ? { ...setting, setting_value: newValue }
          : setting
      ));

      toast({
        title: "Success",
        description: "Setting updated successfully.",
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: "Failed to update setting.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderSettingInput = (setting: SystemSetting) => {
    const value = setting.setting_value;

    switch (setting.setting_key) {
      case 'maintenance_mode':
      case 'user_registration':
      case 'betting_enabled':
      case 'fight_creation_enabled':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value === true || value === 'true'}
              onCheckedChange={(checked) => updateSetting(setting.setting_key, checked)}
              disabled={!isSuperAdmin() || isSaving}
            />
            <Label>{value === true || value === 'true' ? 'Enabled' : 'Disabled'}</Label>
          </div>
        );

      case 'max_bet_amount':
      case 'min_bet_amount':
        return (
          <Input
            type="number"
            value={typeof value === 'string' ? value.replace(/"/g, '') : value}
            onChange={(e) => updateSetting(setting.setting_key, parseInt(e.target.value))}
            disabled={!isSuperAdmin() || isSaving}
            className="w-32"
          />
        );

      case 'platform_name':
        return (
          <Input
            value={typeof value === 'string' ? value.replace(/"/g, '') : value}
            onChange={(e) => updateSetting(setting.setting_key, `"${e.target.value}"`)}
            disabled={!isSuperAdmin() || isSaving}
            className="w-64"
          />
        );

      default:
        return (
          <Input
            value={typeof value === 'string' ? value.replace(/"/g, '') : JSON.stringify(value)}
            onChange={(e) => updateSetting(setting.setting_key, e.target.value)}
            disabled={!isSuperAdmin() || isSaving}
            className="w-64"
          />
        );
    }
  };

  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, SystemSetting[]>);

  if (!isSuperAdmin()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Settings
          </CardTitle>
          <CardDescription>
            Access denied. Only super administrators can view system settings.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          System Settings
        </CardTitle>
        <CardDescription>
          Configure platform settings and feature toggles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">Loading settings...</div>
          ) : (
            Object.entries(groupedSettings).map(([category, categorySettings]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg capitalize">{category} Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categorySettings.map((setting) => (
                      <div key={setting.setting_key} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="font-medium">
                            {setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {setting.description}
                          </p>
                          {setting.is_public && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Public
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {renderSettingInput(setting)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          <div className="flex gap-2 pt-4">
            <Button onClick={fetchSettings} variant="outline" disabled={isLoading}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}