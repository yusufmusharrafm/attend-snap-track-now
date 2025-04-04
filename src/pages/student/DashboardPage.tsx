
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AttendanceStats from '@/components/student/AttendanceStats';
import AttendanceCalendar from '@/components/student/AttendanceCalendar';
import DeviceVerification from '@/components/student/DeviceVerification';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarCheck, User } from 'lucide-react';

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  // Check if user is student
  if (user?.role !== 'student') {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}!
          </p>
        </div>
      </div>
      
      <AttendanceStats />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5" />
              Attendance Overview
            </CardTitle>
            <CardDescription>
              Your attendance data for the current week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceCalendar />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Status
            </CardTitle>
            <CardDescription>
              Manage your device verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeviceVerification />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
