import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/Sidebar';
import { type AuthResponse } from '@/services/mockAuth';
import { Bell, Check, Trash2, Settings } from 'lucide-react';

interface NotificationsProps {
  authResponse: AuthResponse;
  onLogout: () => void;
}

export default function Notifications({ authResponse, onLogout }: NotificationsProps) {
  const { user } = authResponse;

  if (!user) return null;

  const notifications = [
    { 
      id: 1, 
      title: 'Welcome to MyApp!', 
      message: 'Your account has been successfully created.', 
      time: '2 minutes ago', 
      unread: true,
      type: 'success'
    },
    { 
      id: 2, 
      title: 'Profile Update', 
      message: 'Your profile information has been updated.', 
      time: '1 hour ago', 
      unread: false,
      type: 'info'
    },
    { 
      id: 3, 
      title: 'Security Alert', 
      message: 'New login detected from a different device.', 
      time: '2 hours ago', 
      unread: true,
      type: 'warning'
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
                <h1 className="text-3xl font-bold">Notifications</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Stay updated with your activities</p>
              </div>
              <Button variant="outline" className="dark:border-slate-700 dark:hover:bg-slate-700/80">
                <Settings className="mr-2 h-4 w-4" />
                Preferences
              </Button>
            </div>

            <Card className="bg-white dark:bg-slate-900 shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Notifications
                </CardTitle>
                <CardDescription className="dark:text-gray-400">Your latest updates and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border rounded-lg ${notification.unread ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/50' : 'bg-white dark:bg-slate-800/50 dark:border-slate-700'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{notification.title}</h3>
                            {notification.unread && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{notification.message}</p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
                        </div>
                        <div className="flex space-x-1 ml-4">
                          {notification.unread && (
                            <Button variant="ghost" size="sm" className="dark:text-gray-400 dark:hover:bg-slate-700/80">
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="dark:text-gray-400 dark:hover:bg-slate-700/80">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
