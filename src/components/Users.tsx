import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/Sidebar';
import { mockAuthService, type AuthResponse } from '@/services/mockAuth';
import { Users as UsersIcon, UserPlus, Mail, MoreHorizontal } from 'lucide-react';

interface UsersProps {
  authResponse: AuthResponse;
  onLogout: () => void;
}

export default function Users({ authResponse, onLogout }: UsersProps) {
  const { user } = authResponse;
  const allUsers = mockAuthService.getAllUsers();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 text-gray-900 dark:text-gray-100">
      <Sidebar onLogout={onLogout} username={user.username} />
      
      <div className="lg:pl-64">
        <div className="p-4 lg:p-8">
          <div className="pt-12 lg:pt-0">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Users</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage user accounts</p>
              </div>
              <Button className="bg-gradient-to-r from-violet-600 to-blue-600 text-white dark:hover:from-violet-700 dark:hover:to-blue-700">
                <UserPlus className="mr-2 h-4 w-4" />
                Invite User
              </Button>
            </div>

            <Card className="bg-white dark:bg-slate-900 shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersIcon className="h-5 w-5" />
                  All Users ({allUsers.length})
                </CardTitle>
                <CardDescription className="dark:text-gray-400">Registered users in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allUsers.map((userData) => (
                    <div key={userData.id} className="flex items-center justify-between p-4 border dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {userData.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium">{userData.username}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">ID: {userData.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={userData.id === user.id ? "default" : "secondary"} className={userData.id === user.id ? 'dark:bg-primary dark:text-primary-foreground' : 'dark:bg-slate-700 dark:text-slate-300'}>
                          {userData.id === user.id ? 'You' : 'Active'}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Joined {new Date(userData.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" className="dark:text-gray-400 dark:hover:bg-slate-700/80">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="dark:text-gray-400 dark:hover:bg-slate-700/80">
                            <MoreHorizontal className="h-4 w-4" />
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
