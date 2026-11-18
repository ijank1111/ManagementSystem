import React from 'react';
import { useStore } from '../store/useStore';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Settings, 
  LogOut, 
  ShieldCheck,
  BarChart3,
  Building2,
  BookOpen
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, currentTenant, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentUser) return <>{children}</>;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['MANAGER', 'ADMIN'] },
    { icon: MessageSquare, label: 'Complaints', path: '/complaints', roles: ['CONSUMER', 'AGENT', 'SUPPORT', 'MANAGER', 'ADMIN'] },
    { icon: BarChart3, label: 'Reports', path: '/reports', roles: ['MANAGER', 'ADMIN'] },
    { icon: Users, label: 'Team', path: '/team', roles: ['MANAGER', 'ADMIN'] },
    { icon: BookOpen, label: 'Architecture', path: '/architecture', roles: ['ADMIN', 'MANAGER'] },
    { icon: Settings, label: 'Settings', path: '/settings', roles: ['ADMIN', 'MANAGER', 'AGENT', 'SUPPORT', 'CONSUMER'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(currentUser.role));

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col shadow-sm">
        <div className="p-6 border-b flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl">
            {currentTenant?.logo || 'RP'}
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">ResolvePro</h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{currentTenant?.name}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {filteredMenu.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 font-medium transition-all duration-200",
                location.pathname === item.path 
                  ? "bg-slate-100 text-primary" 
                  : "text-slate-600 hover:bg-slate-50"
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon size={18} />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="p-4 border-t bg-slate-50/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{currentUser.role}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="h-16 bg-white border-b sticky top-0 z-10 flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">
            {menuItems.find(i => i.path === location.pathname)?.label || 'Overview'}
          </h2>
          <div className="flex items-center gap-4">
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;