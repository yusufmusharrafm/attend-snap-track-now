
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SubjectAttendance from '@/components/student/SubjectAttendance';
import AttendanceCalendar from '@/components/student/AttendanceCalendar';

const AttendancePage = () => {
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance Records</h1>
        <p className="text-muted-foreground">
          Track your attendance across all subjects
        </p>
      </div>
      
      <Tabs defaultValue="subjects">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="subjects">Subject-wise</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        <TabsContent value="subjects" className="mt-6">
          <SubjectAttendance />
        </TabsContent>
        <TabsContent value="calendar" className="mt-6">
          <div className="max-w-xl mx-auto">
            <AttendanceCalendar />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendancePage;
