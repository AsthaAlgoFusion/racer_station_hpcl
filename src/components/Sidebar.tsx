import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { 
  Home, 
  User, 
  Settings, 
  BarChart3, 
  FileText as FileIcon, // Renamed to avoid conflict with StationForm icon
  Bell, 
  Menu,
  LogOut,
  Users as UsersIcon, // Renamed
  Shield,
  Package, Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
  onLogout: () => void;
  username: string;
}

interface NavItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const navItems: NavItem[] = [
  { title: 'Dashboard', icon: Home, path: '/dashboard' },
  { title: 'Profile', icon: User, path: '/profile' },
  { title: 'Analytics', icon: BarChart3, path: '/analytics' },
    { title: 'Products', icon: Package, path: '/products' },
  { title: 'Spare Parts', icon: Wrench, path: '/spare-parts' },
  { title: 'Documents', icon: FileIcon, path: '/documents' },
  { title: 'Users', icon: UsersIcon, path: '/users' },
  { title: 'Notifications', icon: Bell, path: '/notifications' },
  { title: 'Security', icon: Shield, path: '/security' },
  { title: 'Settings', icon: Settings, path: '/settings' },
];

function SidebarContent({ onLogout, username }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-col h-full 
                   bg-gradient-to-b from-slate-100 to-slate-200 text-slate-800 
                   dark:from-slate-900 dark:to-black dark:text-slate-100">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-slate-300 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Station Portal</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Welcome, {username}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.title}
              onClick={() => navigate(item.path)}
              variant="ghost"
              className={cn(
                "w-full justify-start text-left h-12 transition-all duration-200",
                isActive 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md dark:from-violet-600 dark:to-blue-600" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700/50"
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.title}
            </Button>
          );
        })}
      </nav>

      {/* Footer: Theme Toggle and Logout */}
      <div className="p-4 border-t border-slate-300 dark:border-slate-700 space-y-2">
        <div className="flex justify-center">
           <ThemeToggle />
        </div>
        <Button
          onClick={onLogout}
          variant="ghost"
          className="w-full justify-start h-12
                     text-red-600 hover:text-red-700 hover:bg-red-100/70
                     dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}

export default function Sidebar({ onLogout, username }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 shadow-xl z-30">
        <SidebarContent onLogout={onLogout} username={username} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 
                       bg-white/90 dark:bg-slate-800/90 
                       text-slate-700 dark:text-slate-200
                       backdrop-blur-sm shadow-lg 
                       hover:bg-white dark:hover:bg-slate-700"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 border-r-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <SidebarContent onLogout={onLogout} username={username} />
        </SheetContent>
      </Sheet>
    </>
  );
}
