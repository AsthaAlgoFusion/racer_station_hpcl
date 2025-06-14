import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockAuthService, type AuthResponse } from '@/services/mockAuth';
import { LogOut, User, Users, UserCheck, TrendingUp, Activity, Clock, Settings, Bell } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

interface DashboardProps {
  authResponse: AuthResponse;
  onLogout: () => void;
}

export default function Dashboard({ authResponse, onLogout }: DashboardProps) {
  const { user, isNewUser } = authResponse;
  const totalUsers = mockAuthService.getUserCount();

  if (!user) return null;

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toString(),
      icon: Users,
      trend: '+12%',
      color: 'blue'
    },
    {
      title: 'Active Sessions',
      value: '1', 
      icon: Activity,
      trend: '+100%',
      color: 'green'
    },
    {
      title: 'Login Time',
      value: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: Clock,
      trend: 'Now',
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100">
      <Sidebar onLogout={onLogout} username={user.username} />
      fff
      <div className="lg:pl-64">
        <div className="p-4 lg:p-8">
          <div className="mb-8 pt-12 lg:pt-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back, {user.username}!</p>
              </div>
              {isNewUser && (
                <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700">
                  <UserCheck className="h-3 w-3 mr-1" />
                  New User
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} className="border-0 shadow-sm bg-white dark:bg-slate-900">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                        <p className="text-2xl font-bold mt-2">{stat.value}</p>
                      </div>
                      <div className={`h-12 w-12 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center`}>
                        <Icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                      </div>
                    </div>
                    <div className="flex items-center mt-4">
                      <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400 mr-1" />
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">{stat.trend}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">from last period</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Profile
                </CardTitle>
                <CardDescription className="dark:text-gray-400">Your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</label>
                    <p className="text-sm font-semibold mt-1">{user.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID</label>
                    <p className="text-sm font-semibold mt-1">{user.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Join Date</label>
                    <p className="text-sm font-semibold mt-1">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                    <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription className="dark:text-gray-400">Common tasks and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start dark:border-slate-700 dark:hover:bg-slate-700/80">
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="w-full justify-start dark:border-slate-700 dark:hover:bg-slate-700/80">
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </Button>
                <Button variant="outline" className="w-full justify-start dark:border-slate-700 dark:hover:bg-slate-700/80">
                  <Bell className="mr-2 h-4 w-4" />
                  Notification Preferences
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 dark:border-red-700/50"
                  onClick={onLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-sm mt-6 bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription className="dark:text-gray-400">Current system status and statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'Authentication', detail: 'Mock API Service', color: 'blue', Icon: UserCheck },
                  { title: 'Total Users', detail: `${totalUsers} registered`, color: 'purple', Icon: Users },
                  { title: 'Session', detail: 'Active & Secure', color: 'green', Icon: Activity },
                  { title: 'Account Type', detail: isNewUser ? 'New Account' : 'Returning User', color: 'orange', Icon: UserCheck }
                ].map(item => {
                  const Icon = item.Icon;
                  return (
                    <div key={item.title} className={`p-4 rounded-lg bg-${item.color}-50 dark:bg-slate-800/50 border border-${item.color}-200 dark:border-${item.color}-700/50`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm font-medium text-${item.color}-600 dark:text-${item.color}-400`}>{item.title}</p>
                          <p className={`text-xs text-${item.color}-500 dark:text-${item.color}-500 mt-1`}>{item.detail}</p>
                        </div>
                        {item.title === 'Authentication' || item.title === 'Session' ? (
                          <div className={`h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center`}>
                            <div className="h-2 w-2 rounded-full bg-green-500 dark:bg-green-400"></div>
                          </div>
                        ) : (
                          <Icon className={`h-5 w-5 text-${item.color}-600 dark:text-${item.color}-400`} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
