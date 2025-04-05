
import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useData } from '@/contexts/DataContext';
import { CheckCircle, XCircle, Users } from 'lucide-react';

interface AttendanceInfoProps {
  subjectId: string;
  presentCount: number;
  totalCount: number;
}

const AttendanceInfo = ({ subjectId, presentCount, totalCount }: AttendanceInfoProps) => {
  const { students, getStudentsBySubject } = useData();
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  
  // Get subject name from context
  const { getSubjectName } = useData();
  const subjectName = getSubjectName(subjectId);
  
  // Calculate attendance percentage
  useEffect(() => {
    if (totalCount > 0) {
      const percentage = (presentCount / totalCount) * 100;
      
      // Animate the progress
      let currentPercentage = 0;
      const interval = setInterval(() => {
        currentPercentage += 2;
        setAttendancePercentage(Math.min(currentPercentage, percentage));
        
        if (currentPercentage >= percentage) {
          clearInterval(interval);
        }
      }, 20);
      
      return () => clearInterval(interval);
    }
  }, [presentCount, totalCount]);
  
  const absentCount = totalCount - presentCount;
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium">{subjectName}</h3>
        <div className="flex items-center justify-between mt-2 text-sm">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Total students: {totalCount}</span>
          </div>
          <Badge variant={attendancePercentage > 75 ? "success" : "destructive"}>
            {attendancePercentage.toFixed(0)}% Present
          </Badge>
        </div>
      </div>
      
      <Progress value={attendancePercentage} className="h-2" />
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Present</p>
              <p className="text-2xl font-bold">{presentCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-red-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Absent</p>
              <p className="text-2xl font-bold">{absentCount}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </div>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
        <div className="text-sm text-muted-foreground">
          {presentCount > 0 ? (
            <p>Last marked attendance: Just now</p>
          ) : (
            <p>No attendance marked yet for this session</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceInfo;
