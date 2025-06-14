import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Sidebar from '@/components/Sidebar';
import { type AuthResponse } from '@/services/mockAuth';
import { Shield, Lock, Smartphone, Key, AlertTriangle, CheckCircle } from 'lucide-react';

interface SecurityProps {
  authResponse: AuthResponse;
  onLogout: () => void;
}

export default function Security({ authResponse, onLogout }: SecurityProps) {
  const { user } = authResponse;

  if (!user) return null;

  const securityItems = [
    {
      title: 'Password',
      description: 'Last changed 30 days ago',
      status: 'Good',
      icon: Lock,
      action: 'Change Password'
    },
    {
      title: 'Two-Factor Authentication',
      description: 'Not enabled',
      status: 'Warning',
      icon: Smartphone,
      action: 'Enable 2FA'
    },
    {
      title: 'API Keys',
      description: '2 active keys',
      status: 'Good',
      icon: Key,
      action: 'Manage Keys'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 text-gray-900 dark:text-gray-100">
      <Sidebar onLogout={onLogout} username={user.username} />
      
      <div className="lg:pl-64">
        <div className="p-4 lg:p-8">
          <div className="pt-12 lg:pt-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Security</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account security settings</p>
            </div>

            <Card className="mb-6 bg-white dark:bg-slate-900 shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Security Status
                </CardTitle>
                <CardDescription className="dark:text-gray-400">Your account security overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium">Account Secured</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                    75% Security Score
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {securityItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card key={index} className="bg-white dark:bg-slate-900 shadow-sm border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-lg">
                            <Icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge 
                            variant={item.status === 'Good' ? 'secondary' : 'destructive'}
                            className={item.status === 'Good' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' 
                              : 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300'}
                          >
                            {item.status === 'Warning' ? <AlertTriangle className="h-3 w-3 mr-1" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                            {item.status}
                          </Badge>
                          <Button variant="outline" size="sm" className="dark:border-slate-700 dark:hover:bg-slate-700/80">
                            {item.action}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
