import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge'; // Badge not used, can be removed
import { Label } from '@/components/ui/label';
import Sidebar from '@/components/Sidebar';
import { type AuthResponse } from '@/services/mockAuth';
import { Settings as SettingsIcon, User, Bell, Globe, Palette, Monitor, Save } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';

interface SettingsProps {
  authResponse: AuthResponse;
  onLogout: () => void;
}

// Define a more specific type for appSettings keys
type AppSettingsKeys = 
  | 'profileVisibility' 
  | 'notifications' 
  | 'autoSave' 
  | 'language' 
  | 'displayDensity' 
  | 'pushNotifications' 
  | 'emailUpdates' 
  | 'smsAlerts';

type AppSettings = {
  profileVisibility: 'Public' | 'Private' | 'Friends Only';
  notifications: boolean; // This is "Email Notifications"
  autoSave: boolean;
  language: 'English' | 'Spanish' | 'French';
  displayDensity: 'Comfortable' | 'Compact';
  pushNotifications: boolean;
  emailUpdates: boolean;
  smsAlerts: boolean;
};


export default function Settings({ authResponse, onLogout }: SettingsProps) {
  const { user } = authResponse;
  const { theme, setTheme } = useTheme();

  const [appSettings, setAppSettings] = useState<AppSettings>({
    profileVisibility: 'Public',
    notifications: true, 
    autoSave: true,
    language: 'English',
    displayDensity: 'Comfortable',
    pushNotifications: true,
    emailUpdates: false,
    smsAlerts: false,
  });

  if (!user) return null;

  const handleToggle = (key: AppSettingsKeys) => {
    setAppSettings(prev => {
      const value = prev[key];
      if (typeof value === 'boolean') {
        return { ...prev, [key]: !value };
      }
      return prev; // Should not happen if keys are correctly typed
    });
  };

  const handleSettingChange = (key: AppSettingsKeys, newValue: string) => {
    setAppSettings(prev => ({ ...prev, [key]: newValue }));
  };
  
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  interface SettingItem {
    label: string;
    key?: AppSettingsKeys;
    type: 'toggle' | 'select' | 'theme_select';
    options?: string[];
  }
  
  interface SettingSection {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    items: SettingItem[];
  }

  const settingSections: SettingSection[] = [
    {
      title: 'Account Preferences',
      icon: User,
      items: [
        { label: 'Profile Visibility', key: 'profileVisibility', type: 'select', options: ['Public', 'Private', 'Friends Only'] },
        { label: 'Email Notifications', key: 'notifications', type: 'toggle' },
        { label: 'Auto-save Changes', key: 'autoSave', type: 'toggle' }
      ]
    },
    {
      title: 'Appearance',
      icon: Palette,
      items: [
        { label: 'Theme', type: 'theme_select', options: ['light', 'dark', 'system'] },
        { label: 'Language', key: 'language', type: 'select', options: ['English', 'Spanish', 'French'] },
        { label: 'Display Density', key: 'displayDensity', type: 'select', options: ['Comfortable', 'Compact'] }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Push Notifications', key: 'pushNotifications', type: 'toggle' },
        { label: 'Email Updates', key: 'emailUpdates', type: 'toggle' },
        { label: 'SMS Alerts', key: 'smsAlerts', type: 'toggle' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 text-gray-900 dark:text-gray-100">
      <Sidebar onLogout={onLogout} username={user.username} />
      
      <div className="lg:pl-64">
        <div className="p-4 lg:p-8">
          <div className="pt-12 lg:pt-0">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Customize your app experience</p>
              </div>
              <Button className="bg-gradient-to-r from-violet-600 to-blue-600 text-white dark:hover:from-violet-700 dark:hover:to-blue-700">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>

            <Card className="mb-6 bg-white dark:bg-slate-900 shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Quick Overview
                </CardTitle>
                <CardDescription className="dark:text-gray-400">Your current settings summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-slate-800/50 rounded-lg border border-blue-200 dark:border-blue-700/50">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium">Theme</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 capitalize">{theme}</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-slate-800/50 rounded-lg border border-green-200 dark:border-green-700/50">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="font-medium">Email Notifications</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{appSettings.notifications ? 'Enabled' : 'Disabled'}</p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-slate-800/50 rounded-lg border border-purple-200 dark:border-purple-700/50">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <span className="font-medium">Language</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{appSettings.language}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {settingSections.map((section, sectionIndex) => {
                const Icon = section.icon;
                return (
                  <Card key={sectionIndex} className="bg-white dark:bg-slate-900 shadow-sm border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        {section.title}
                      </CardTitle>
                      <CardDescription className="dark:text-gray-400">Configure {section.title.toLowerCase()} options</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {section.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between p-4 border dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50">
                          <div>
                            <Label className="font-medium">{item.label}</Label>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {item.type === 'toggle' 
                                ? (appSettings[item.key!] ? 'Enabled' : 'Disabled') // Show current state for toggle
                                : `Current: ${item.type === 'theme_select' ? theme : appSettings[item.key!]}`
                              }
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            {item.type === 'toggle' && item.key && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleToggle(item.key as AppSettingsKeys)}
                                className="dark:border-slate-600 dark:hover:bg-slate-700 w-24"
                              >
                                {appSettings[item.key] ? 'Disable' : 'Enable'}
                              </Button>
                            )}
                             {item.type === 'theme_select' && (
                                <select 
                                  value={theme} 
                                  onChange={(e) => handleThemeChange(e.target.value)}
                                  className="p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                >
                                  {item.options?.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
                                </select>
                            )}
                            {item.type === 'select' && item.key && (
                                <select 
                                  value={appSettings[item.key] as string}
                                  onChange={(e) => handleSettingChange(item.key as AppSettingsKeys, e.target.value)}
                                  className="p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                >
                                  {item.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="mt-8 border-red-200 dark:border-red-700/50 bg-white dark:bg-slate-900 shadow-sm">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                <CardDescription className="dark:text-gray-400">Actions that cannot be undone</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-700/50 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <div>
                    <h3 className="font-medium text-red-900 dark:text-red-300">Delete Account</h3>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
