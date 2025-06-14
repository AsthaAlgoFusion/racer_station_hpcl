import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Sidebar from '@/components/Sidebar';
import { type AuthResponse } from '@/services/mockAuth';
import { User, Mail, Calendar, MapPin, Phone, Edit, Save, Camera } from 'lucide-react';
import { useState } from 'react';

interface ProfileProps {
  authResponse: AuthResponse;
  onLogout: () => void;
}

export default function Profile({ authResponse, onLogout }: ProfileProps) {
  const { user } = authResponse;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: 'user@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    bio: 'Software developer passionate about creating amazing user experiences.'
  });

  if (!user) return null;

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Sidebar onLogout={onLogout} username={user.username} />
      
      <div className="lg:pl-64">
        <div className="p-4 lg:p-8">
          <div className="pt-12 lg:pt-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600 mt-1">Manage your account information</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Picture Card */}
              <Card className="lg:col-span-1">
                <CardHeader className="text-center">
                  <div className="relative mx-auto">
                    <div className="w-32 h-32 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <Button size="icon" className="absolute bottom-0 right-0 rounded-full">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="mt-4">{user.username}</CardTitle>
                  <CardDescription>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Active User
                    </Badge>
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Profile Information */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your profile details</CardDescription>
                  </div>
                  <Button 
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    variant={isEditing ? "default" : "outline"}
                  >
                    {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                    {isEditing ? 'Save' : 'Edit'}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                      <div className="flex items-center mt-1">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <Input 
                          id="username" 
                          value={user.username} 
                          disabled 
                          className="bg-gray-50"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="user-id" className="text-sm font-medium">User ID</Label>
                      <Input 
                        id="user-id" 
                        value={user.id} 
                        disabled 
                        className="bg-gray-50 mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                      <div className="flex items-center mt-1">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <Input 
                          id="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          disabled={!isEditing}
                          className={isEditing ? '' : 'bg-gray-50'}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                      <div className="flex items-center mt-1">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <Input 
                          id="phone" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          disabled={!isEditing}
                          className={isEditing ? '' : 'bg-gray-50'}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                      <div className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <Input 
                          id="location" 
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          disabled={!isEditing}
                          className={isEditing ? '' : 'bg-gray-50'}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="joined" className="text-sm font-medium">Joined</Label>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <Input 
                          id="joined" 
                          value={user.createdAt.toLocaleDateString()} 
                          disabled 
                          className="bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                    <textarea 
                      id="bio"
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      disabled={!isEditing}
                      className={`w-full mt-1 px-3 py-2 border border-gray-300 rounded-md resize-none ${isEditing ? 'focus:outline-none focus:ring-2 focus:ring-blue-500' : 'bg-gray-50'}`}
                      placeholder="Tell us about yourself..."
                    />
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
