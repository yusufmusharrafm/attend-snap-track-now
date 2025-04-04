
import { 
  Users, 
  Book, 
  AlertTriangle, 
  Calendar, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';

const AdminStats = () => {
  const { 
    departments, 
    students, 
    subjects, 
    attendanceRecords 
  } = useData();
  
  // Today's date
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate today's attendance
  const todaysRecords = attendanceRecords.filter(record => record.date === today);
  const presentToday = todaysRecords.filter(record => record.present).length;
  const totalToday = todaysRecords.length;
  const attendanceRate = totalToday > 0 ? (presentToday / totalToday) * 100 : 0;
  
  // Find departments with lowest attendance
  const departmentAttendance = attendanceRecords.reduce((acc, record) => {
    // Find student's department
    const student = students.find(s => s.id === record.studentId);
    if (!student) return acc;
    
    const deptId = student.departmentId;
    
    if (!acc[deptId]) {
      acc[deptId] = {
        present: 0,
        total: 0,
        percentage: 0
      };
    }
    
    acc[deptId].total += 1;
    if (record.present) {
      acc[deptId].present += 1;
    }
    
    acc[deptId].percentage = (acc[deptId].present / acc[deptId].total) * 100;
    
    return acc;
  }, {} as Record<string, { present: number; total: number; percentage: number }>);
  
  // Convert to array and find lowest
  const departmentAttendanceArray = Object.entries(departmentAttendance)
    .map(([deptId, stats]) => {
      const dept = departments.find(d => d.id === deptId);
      return {
        departmentId: deptId,
        name: dept ? dept.name : 'Unknown',
        ...stats
      };
    })
    .sort((a, b) => a.percentage - b.percentage);
  
  const lowestDepartment = departmentAttendanceArray.length > 0 ? departmentAttendanceArray[0] : null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{students.length}</div>
          <p className="text-xs text-muted-foreground">
            Across {departments.length} departments
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
          <Book className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{subjects.length}</div>
          <p className="text-xs text-muted-foreground">
            In current academic term
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{attendanceRate.toFixed(1)}%</div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
              <span>{presentToday} present</span>
            </div>
            <div className="flex items-center">
              <XCircle className="h-3 w-3 mr-1 text-red-500" />
              <span>{totalToday - presentToday} absent</span>
            </div>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-muted">
            <div 
              className="h-1.5 rounded-full bg-primary" 
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Attendance Alert</CardTitle>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          {lowestDepartment ? (
            <>
              <div className="text-2xl font-bold">
                <span className={
                  lowestDepartment.percentage < 60 ? 'text-red-500' : 
                  lowestDepartment.percentage < 75 ? 'text-amber-500' : 
                  'text-muted-foreground'
                }>
                  {lowestDepartment.percentage.toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Lowest attendance in {lowestDepartment.name}
              </p>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">N/A</div>
              <p className="text-xs text-muted-foreground">
                No attendance data available
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
