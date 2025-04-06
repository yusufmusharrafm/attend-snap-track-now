
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import FacultyStats from '@/components/faculty/FacultyStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FacultyQRCodeGenerator from '@/components/faculty/FacultyQRCodeGenerator';
import StudentPhotoGallery from '@/components/faculty/StudentPhotoGallery';
import TimetableManager from '@/components/faculty/TimetableManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, UserCheck, FileText, Calendar } from 'lucide-react';

const FacultyDashboardPage = () => {
  const { user, isAuthenticated, isFaculty } = useAuth();
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  // Check if user is faculty
  if (!isFaculty) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Faculty Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}!
        </p>
      </div>
      
      <FacultyStats />
      
      <Tabs defaultValue="qrcode" className="space-y-5">
        <TabsList className="grid grid-cols-4 gap-4 w-full max-w-md">
          <TabsTrigger value="qrcode" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            <span className="hidden sm:inline">QR Attendance</span>
            <span className="sm:hidden">QR</span>
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Students</span>
            <span className="sm:hidden">List</span>
          </TabsTrigger>
          <TabsTrigger value="timetable" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Timetable</span>
            <span className="sm:hidden">Time</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Reports</span>
            <span className="sm:hidden">Rep</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="qrcode">
          <div className="space-y-5">
            <h2 className="text-xl font-semibold tracking-tight">QR Code Generator</h2>
            <p className="text-sm text-muted-foreground">
              Generate secure 45-second QR codes for taking attendance. The QR codes can only be used once and include security measures to prevent sharing.
            </p>
            <FacultyQRCodeGenerator />
          </div>
        </TabsContent>
        
        <TabsContent value="students">
          <div className="space-y-5">
            <h2 className="text-xl font-semibold tracking-tight">Class Students</h2>
            <p className="text-sm text-muted-foreground">
              View students in your class. Students highlighted in red are absent today.
            </p>
            <StudentPhotoGallery />
          </div>
        </TabsContent>
        
        <TabsContent value="timetable">
          <div className="space-y-5">
            <h2 className="text-xl font-semibold tracking-tight">Timetable Management</h2>
            <p className="text-sm text-muted-foreground">
              View and manage class timetables for each department and track scheduled subjects.
            </p>
            <TimetableManager />
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="space-y-5">
            <h2 className="text-xl font-semibold tracking-tight">Quick Reports</h2>
            <p className="text-sm text-muted-foreground">
              View attendance trends and summary for today's classes. For detailed reports, visit the Reports page.
            </p>
            <Card>
              <CardHeader>
                <CardTitle>Today's Summary</CardTitle>
                <CardDescription>
                  Overview of today's attendance across all classes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-10 text-muted-foreground">
                  Full reporting will be available when connected to a backend database. Visit the Reports page for more options.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FacultyDashboardPage;
