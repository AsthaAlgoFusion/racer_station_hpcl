import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Sidebar from '@/components/Sidebar';
import { type AuthResponse } from '@/services/mockAuth';
import { FileText, Download, Share, Eye, Plus } from 'lucide-react';

interface DocumentsProps {
  authResponse: AuthResponse;
  onLogout: () => void;
}

export default function Documents({ authResponse, onLogout }: DocumentsProps) {
  const { user } = authResponse;

  if (!user) return null;

  const documents = [
    { name: 'Project Proposal.pdf', size: '2.4 MB', modified: '2 days ago', type: 'PDF' },
    { name: 'Meeting Notes.docx', size: '1.1 MB', modified: '1 week ago', type: 'Word' },
    { name: 'Budget Report.xlsx', size: '3.2 MB', modified: '3 days ago', type: 'Excel' },
    { name: 'Design Assets.zip', size: '15.6 MB', modified: '5 days ago', type: 'Archive' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 text-gray-900 dark:text-gray-100">
      <Sidebar onLogout={onLogout} username={user.username} />
      
      <div className="lg:pl-64">
        <div className="p-4 lg:p-8">
          <div className="pt-12 lg:pt-0">
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Documents</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your files and documents</p>
              </div>
              <Button className="bg-gradient-to-r from-violet-600 to-blue-600 text-white dark:hover:from-violet-700 dark:hover:to-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </div>

            <div className="grid gap-4">
              {documents.map((doc, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow bg-white dark:bg-slate-900 border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{doc.name}</h3>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-sm text-gray-500 dark:text-gray-400">{doc.size}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{doc.modified}</span>
                            <Badge variant="secondary" className="dark:bg-slate-700 dark:text-slate-300">{doc.type}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="dark:text-gray-400 dark:hover:bg-slate-700/80">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="dark:text-gray-400 dark:hover:bg-slate-700/80">
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="dark:text-gray-400 dark:hover:bg-slate-700/80">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
