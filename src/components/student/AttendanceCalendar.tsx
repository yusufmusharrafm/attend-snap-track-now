
import { useState } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

const AttendanceCalendar = () => {
  const { user } = useAuth();
  const { getStudentAttendance } = useData();
  const [date, setDate] = useState<Date>(new Date());
  
  if (!user) return null;

  // Get start and end of current week
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);
  
  // Get student attendance for current week
  const studentId = user.id;
  const weekStartStr = format(weekStart, 'yyyy-MM-dd');
  const weekEndStr = format(weekEnd, 'yyyy-MM-dd');
  const attendanceData = getStudentAttendance(studentId, weekStartStr, weekEndStr);
  
  // Calculate attendance percentage for each day
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const getDayAttendance = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const dayRecords = attendanceData.filter(record => record.date === dateStr);
    
    if (dayRecords.length === 0) return null;
    
    const presentCount = dayRecords.filter(record => record.present).length;
    const totalCount = dayRecords.length;
    
    return {
      percentage: totalCount > 0 ? (presentCount / totalCount) * 100 : 0,
      present: presentCount,
      total: totalCount
    };
  };
  
  const previousWeek = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 7);
    setDate(newDate);
  };
  
  const nextWeek = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 7);
    setDate(newDate);
  };
  
  const getColorForPercentage = (percentage: number | null) => {
    if (percentage === null) return 'bg-gray-200';
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 75) return 'bg-green-300';
    if (percentage >= 50) return 'bg-yellow-400';
    if (percentage >= 25) return 'bg-orange-400';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Weekly Attendance</h3>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={previousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="min-w-[160px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, 'MMM d, yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {daysInWeek.map((day, index) => {
          const attendance = getDayAttendance(day);
          const dayLabel = format(day, 'EEE');
          const dateNum = format(day, 'd');
          const isToday = isSameDay(day, new Date());
          
          return (
            <div 
              key={index} 
              className={`p-2 rounded-lg border ${isToday ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="text-center text-sm font-medium">{dayLabel}</div>
              <div className="text-center font-bold text-lg">{dateNum}</div>
              <div className="mt-2 h-2 rounded-full bg-gray-200">
                <div 
                  className={`h-2 rounded-full ${getColorForPercentage(attendance?.percentage || null)}`}
                  style={{ width: `${attendance?.percentage || 0}%` }}
                />
              </div>
              <div className="mt-1 text-center text-xs text-muted-foreground">
                {attendance 
                  ? `${attendance.present}/${attendance.total} periods` 
                  : 'No data'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceCalendar;
