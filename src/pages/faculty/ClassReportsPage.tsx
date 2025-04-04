
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/contexts/DataContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const ClassReportsPage = () => {
  const { isAuthenticated, isFaculty } = useAuth();
  const { departments, subjects, getSubjectAttendance, getStudentName, getDepartmentName, getDepartmentSubjects } = useData();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  // Check if user is faculty
  if (!isFaculty) {
    return <Navigate to="/dashboard" />;
  }

  // Get subjects for selected department
  const departmentSubjects = selectedDepartment
    ? getDepartmentSubjects(selectedDepartment)
    : [];

  // Get attendance data for selected subject
  const attendanceData = selectedSubject 
    ? getSubjectAttendance(selectedSubject)
    : [];

  // Process data for charts
  const getDailyAttendanceData = () => {
    if (!attendanceData.length) return [];
    
    // Group by date
    const groupedByDate = attendanceData.reduce((acc, record) => {
      if (!acc[record.date]) {
        acc[record.date] = { present: 0, absent: 0 };
      }
      
      if (record.present) {
        acc[record.date].present += 1;
      } else {
        acc[record.date].absent += 1;
      }
      
      return acc;
    }, {} as Record<string, { present: number, absent: number }>);
    
    // Convert to array format for chart
    return Object.entries(groupedByDate)
      .map(([date, data]) => ({
        date,
        present: data.present,
        absent: data.absent,
        total: data.present + data.absent,
        attendanceRate: parseFloat(((data.present / (data.present + data.absent)) * 100).toFixed(1))
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };
  
  const getStudentAttendanceData = () => {
    if (!attendanceData.length) return [];
    
    // Group by student
    const groupedByStudent = attendanceData.reduce((acc, record) => {
      if (!acc[record.studentId]) {
        acc[record.studentId] = { present: 0, absent: 0, name: getStudentName(record.studentId) };
      }
      
      if (record.present) {
        acc[record.studentId].present += 1;
      } else {
        acc[record.studentId].absent += 1;
      }
      
      return acc;
    }, {} as Record<string, { name: string, present: number, absent: number }>);
    
    // Convert to array format for chart
    return Object.entries(groupedByStudent)
      .map(([studentId, data]) => ({
        studentId,
        studentName: data.name,
        present: data.present,
        absent: data.absent,
        total: data.present + data.absent,
        attendanceRate: parseFloat(((data.present / (data.present + data.absent)) * 100).toFixed(1))
      }))
      .sort((a, b) => b.attendanceRate - a.attendanceRate);
  };
  
  const chartData = getDailyAttendanceData();
  const studentData = getStudentAttendanceData();

  // Download report function (simulated)
  const handleDownloadReport = () => {
    // In a real app, this would generate a CSV or PDF report
    alert("Downloading attendance report...");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Class Reports</h1>
          <p className="text-muted-foreground">
            View and analyze attendance data
          </p>
        </div>
        {selectedSubject && (
          <Button onClick={handleDownloadReport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Select Class</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select
                value={selectedDepartment}
                onValueChange={(value) => {
                  setSelectedDepartment(value);
                  setSelectedSubject('');
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
                disabled={!selectedDepartment}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    selectedDepartment 
                      ? "Select Subject" 
                      : "Select a department first"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {departmentSubjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {selectedSubject && (
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList>
            <TabsTrigger value="daily">Daily Trends</TabsTrigger>
            <TabsTrigger value="students">Student Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily Attendance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="present" name="Present" fill="#4ade80" />
                      <Bar dataKey="absent" name="Absent" fill="#f87171" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Attendance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={studentData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} unit="%" />
                      <YAxis type="category" dataKey="studentName" width={100} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Attendance Rate']} />
                      <Legend />
                      <Bar dataKey="attendanceRate" name="Attendance Rate" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      
      {!selectedSubject && (
        <div className="py-12 text-center text-muted-foreground">
          Select a department and subject to view attendance reports
        </div>
      )}
    </div>
  );
};

export default ClassReportsPage;
