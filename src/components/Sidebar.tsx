
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Book, 
  CalendarCheck, 
  Home, 
  QrCode, 
  Settings, 
  Users,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar = () => {
  const { isFaculty } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Navigation items based on user role
  const studentNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Scan QR', path: '/scan', icon: QrCode },
    { name: 'Attendance', path: '/attendance', icon: CalendarCheck },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  const facultyNavItems = [
    { name: 'Dashboard', path: '/faculty', icon: Home },
    { name: 'Departments', path: '/faculty/departments', icon: Book },
    { name: 'Students', path: '/faculty/students', icon: Users },
    { name: 'Class Reports', path: '/faculty/reports', icon: FileText },
    { name: 'Settings', path: '/faculty/settings', icon: Settings }
  ];

  const navItems = isFaculty ? facultyNavItems : studentNavItems;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-sidebar text-sidebar-foreground border-r border-border z-40 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <QrCode className="h-6 w-6" />
              <span className="font-bold text-lg">AttendSnap</span>
            </Link>
          )}
          {collapsed && (
            <div className="mx-auto">
              <QrCode className="h-6 w-6" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className={cn(
            "text-sm text-sidebar-foreground/70",
            collapsed ? "text-center" : ""
          )}>
            {!collapsed && <p>AttendSnap v1.0</p>}
            {collapsed && <p>v1.0</p>}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
