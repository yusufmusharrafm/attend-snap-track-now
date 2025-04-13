
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminStats from '@/components/admin/AdminStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminQRCodeGenerator from '@/components/admin/QRCodeGenerator';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Settings, FileText } from 'lucide-react';
import AttendanceAnalytics from '@/components/admin/AttendanceAnalytics';

const AdminDashboardPage = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  // Check if user is admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  // Quick access cards for admin functions
  const adminActions = [
    {
      title: "Manage Students",
      description: "Add, edit, or remove students from the system",
      icon: <Users className="h-8 w-8 text-blue-500" />,
      link: "/admin/students"
    },
    {
      title: "Manage Departments",
      description: "Create and organize academic departments",
      icon: <BookOpen className="h-8 w-8 text-green-500" />,
      link: "/admin/departments"
    },
    {
      title: "System Settings",
      description: "Configure system settings and user permissions",
      icon: <Settings className="h-8 w-8 text-purple-500" />,
      link: "/admin/settings"
    },
    {
      title: "Reports",
      description: "Generate and view attendance reports",
      icon: <FileText className="h-8 w-8 text-orange-500" />,
      link: "/admin/reports"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}!
        </p>
      </div>
      
      <AdminStats />
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Analytics Dashboard</h2>
        <AttendanceAnalytics />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminActions.map((action, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">{action.title}</CardTitle>
                <div className="rounded-full p-2 bg-muted/50">
                  {action.icon}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-3">{action.description}</CardDescription>
                <Button asChild className="w-full">
                  <Link to={action.link}>Go to {action.title}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="space-y-6">
        <h2 className="text-xl font-semibold tracking-tight">QR Code Generator</h2>
        <AdminQRCodeGenerator />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
