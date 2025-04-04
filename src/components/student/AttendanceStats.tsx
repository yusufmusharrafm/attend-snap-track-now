
import { CalendarCheck, Clock, AlertTriangle } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, startOfWeek, endOfWeek, addDays } from 'date-fns';

const AttendanceStats = () => {
  const { user } = useAuth();
  const { getStudentAttendance, getSubjectName } = useData();
  
  if (!user) return null;
  
  // Get today's date as string
  const today = format(new Date(), 'yyyy-MM-dd');
  
  // Get weekly date range
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const weekStartStr = format(weekStart, 'yyyy-MM-dd');
  const weekEndStr = format(weekEnd, 'yyyy-MM-dd');
  
  // Get attendance data
  const todayAttendance = getStudentAttendance(user.id, today, today);
  const weeklyAttendance = getStudentAttendance(user.id, weekStartStr, weekEndStr);
  
  // Calculate stats
  const todayPresent = todayAttendance.filter(record => record.present).length;
  const todayTotal = todayAttendance.length;
  const todayPercentage = todayTotal > 0 ? (todayPresent / todayTotal) * 100 : 0;
  
  const weeklyPresent = weeklyAttendance.filter(record => record.present).length;
  const weeklyTotal = weeklyAttendance.length;
  const weeklyPercentage = weeklyTotal > 0 ? (weeklyPresent / weeklyTotal) * 100 : 0;
  
  // Find subjects with lowest attendance
  const subjectAttendance = weeklyAttendance.reduce((acc, record) => {
    if (!acc[record.subjectId]) {
      acc[record.subjectId] = {
        present: 0,
        total: 0,
        percentage: 0
      };
    }
    
    acc[record.subjectId].total += 1;
    if (record.present) {
      acc[record.subjectId].present += 1;
    }
    
    acc[record.subjectId].percentage = (acc[record.subjectId].present / acc[record.subjectId].total) * 100;
    
    return acc;
  }, {} as Record<string, { present: number; total: number; percentage: number }>);
  
  // Convert to array and sort by percentage
  const subjectAttendanceArray = Object.entries(subjectAttendance)
    .map(([subjectId, stats]) => ({ 
      subjectId, 
      name: getSubjectName(subjectId), 
      ...stats 
    }))
    .sort((a, b) => a.percentage - b.percentage);
  
  // Get next class
  const now = new Date();
  const currentHour = now.getHours();
  
  // Mock next class data
  const periods = [9, 10, 11, 12, 14, 15, 16, 17];
  let nextPeriod = null;
  let nextPeriodTime = '';
  
  for (const period of periods) {
    if (currentHour < period) {
      nextPeriod = periods.indexOf(period) + 1;
      nextPeriodTime = `${period}:00`;
      break;
    }
  }
  
  // If all periods for today have passed, show first period for tomorrow
  if (!nextPeriod) {
    nextPeriod = 1;
    nextPeriodTime = '9:00';
    const tomorrow = addDays(new Date(), 1);
    nextPeriodTime = `Tomorrow, ${nextPeriodTime}`;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
          <CalendarCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayPercentage.toFixed(0)}%</div>
          <p className="text-xs text-muted-foreground">
            {todayPresent} of {todayTotal} periods attended
          </p>
          <div className="mt-4 h-2 w-full rounded-full bg-muted">
            <div 
              className="h-2 rounded-full bg-primary" 
              style={{ width: `${todayPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Weekly Overview</CardTitle>
          <CalendarCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{weeklyPercentage.toFixed(0)}%</div>
          <p className="text-xs text-muted-foreground">
            {weeklyPresent} of {weeklyTotal} periods attended this week
          </p>
          <div className="mt-4 h-2 w-full rounded-full bg-muted">
            <div 
              className="h-2 rounded-full bg-primary" 
              style={{ width: `${weeklyPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>
      
      {nextPeriod ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Next Class</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Period {nextPeriod}</div>
            <p className="text-xs text-muted-foreground">Starts at {nextPeriodTime}</p>
            <div className="mt-4 text-sm">
              {currentHour < 17 ? (
                <p>Remember to scan attendance QR code</p>
              ) : (
                <p>No more classes today</p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Attendance Warning</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {subjectAttendanceArray.length > 0 ? (
                <>{subjectAttendanceArray[0].percentage.toFixed(0)}%</>
              ) : (
                <>N/A</>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {subjectAttendanceArray.length > 0 ? (
                <>Lowest attendance in {subjectAttendanceArray[0].name}</>
              ) : (
                <>No attendance data available</>
              )}
            </p>
            {subjectAttendanceArray.length > 0 && subjectAttendanceArray[0].percentage < 75 && (
              <div className="mt-4 text-sm text-amber-500">
                <p>Below 75% attendance threshold!</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AttendanceStats;
