import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Sidebar from '@/components/Sidebar';
import { type AuthResponse } from '@/services/mockAuth';
import { TrendingUp, Users, Activity, Clock, BarChart3, PieChart } from 'lucide-react';

interface AnalyticsProps {
  authResponse: AuthResponse;
  onLogout: () => void;
}

export default function Analytics({ authResponse, onLogout }: AnalyticsProps) {
  const { user } = authResponse;

  if (!user) return null;

  const analyticsData = [
    { title: 'Page Views', value: '12,483', change: '+12%', icon: BarChart3, color: 'blue' },
    { title: 'Active Users', value: '1,247', change: '+8%', icon: Users, color: 'green' },
    { title: 'Sessions', value: '3,456', change: '+15%', icon: Activity, color: 'purple' },
    { title: 'Avg. Session', value: '2m 34s', change: '+3%', icon: Clock, color: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 text-gray-900 dark:text-gray-100">
      <Sidebar onLogout={onLogout} username={user.username} />
      
      <div className="lg:pl-64">
        <div className="p-4 lg:p-8">
          <div className="pt-12 lg:pt-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Analytics</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Track your performance and insights</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {analyticsData.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.title} className="bg-white dark:bg-slate-900 shadow-sm border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                          <p className="text-2xl font-bold mt-2">{stat.value}</p>
                          <div className="flex items-center mt-2">
                            <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400 mr-1" />
                            <span className="text-sm text-green-600 dark:text-green-400 font-medium">{stat.change}</span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                           <Icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white dark:bg-slate-900 shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Traffic Overview
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">Last 30 days performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Chart visualization would go here</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-900 shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    User Distribution
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">User segments breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Pie chart would go here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
