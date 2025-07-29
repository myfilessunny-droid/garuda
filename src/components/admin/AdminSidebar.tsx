import React from 'react';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Target, 
  FileText, 
  Camera, 
  Calendar, 
  Users,
  Settings,
  Mail 
} from 'lucide-react';

type ActiveTab = 'dashboard' | 'programs' | 'stories' | 'gallery' | 'events' | 'donations' | 'volunteers' | 'participants' | 'content' | 'subscribers';

interface AdminSidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'programs', label: 'Programs', icon: Target },
    { id: 'stories', label: 'Stories & Blog', icon: FileText },
    { id: 'gallery', label: 'Gallery', icon: Camera },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'donations', label: 'Donations', icon: '₹' },
    { id: 'volunteers', label: 'Volunteers', icon: Users },
    { id: 'participants', label: 'Participants', icon: Users },
    { id: 'subscribers', label: 'Subscribers', icon: Mail },
    { id: 'content', label: 'Website Content', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-border fixed left-0 top-16 bottom-0 overflow-y-auto">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id as ActiveTab)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-left text-sm rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary text-white" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {typeof item.icon === 'string' ? (
                    <span className="text-lg font-bold">{item.icon}</span>
                  ) : (
                    <item.icon className="w-4 h-4" />
                  )}
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;