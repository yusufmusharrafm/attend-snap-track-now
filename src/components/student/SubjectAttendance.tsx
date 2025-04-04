import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

const SubjectAttendance = () => {
  const { user } = useAuth();
  const { 
    subjects, 
    getStudentAttendance, 
    getDepartmentSubjects,
    getSubjectName
  } = useData();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  
  if (!user || user.role !== 'student' || !user.department) return null;
  
  // Get all subjects for student's department
  const departmentSubjects = getDepartmentSubjects(user.department);
  
  // Get student's attendance records - fixing by adding start/end date parameters
  // Using a date range that covers the entire semester for a comprehensive view
  const startDate = '2025-01-01'; // Beginning of the semester
  const endDate = '2025-12-31'; // End of the semester
  const allAttendanceRecords = getStudentAttendance(user.id, startDate, endDate);
  
  // Filter records by selected subject
  const filteredRecords = selectedSubject === 'all'
    ? allAttendanceRecords
    : allAttendanceRecords.filter(record => record.subjectId === selectedSubject);
  
  // Group records by subject and calculate stats
  const subjectStats = filteredRecords.reduce((acc, record) => {
    if (!acc[record.subjectId]) {
      acc[record.subjectId] = {
        subjectId: record.subjectId,
        subjectName: getSubjectName(record.subjectId),
        present: 0,
        absent: 0,
        total: 0,
        percentage: 0
      };
    }
    
    acc[record.subjectId].total += 1;
    if (record.present) {
      acc[record.subjectId].present += 1;
    } else {
      acc[record.subjectId].absent += 1;
    }
    
    acc[record.subjectId].percentage = (acc[record.subjectId].present / acc[record.subjectId].total) * 100;
    
    return acc;
  }, {} as Record<string, {
    subjectId: string;
    subjectName: string;
    present: number;
    absent: number;
    total: number;
    percentage: number;
  }>);
  
  // Convert to array for rendering
  const statsArray = Object.values(subjectStats).sort((a, b) => 
    a.subjectName.localeCompare(b.subjectName)
  );
  
  // Calculate overall stats
  const overallPresent = statsArray.reduce((sum, stat) => sum + stat.present, 0);
  const overallTotal = statsArray.reduce((sum, stat) => sum + stat.total, 0);
  const overallPercentage = overallTotal > 0 ? (overallPresent / overallTotal) * 100 : 0;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Subject Attendance</h3>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Subjects</SelectLabel>
              <SelectItem value="all">All Subjects</SelectItem>
              {departmentSubjects.map(subject => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <Table>
        <TableCaption>
          Overall Attendance: {overallPercentage.toFixed(1)}% ({overallPresent}/{overallTotal} periods)
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead className="text-right">Present</TableHead>
            <TableHead className="text-right">Absent</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Percentage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {statsArray.length > 0 ? (
            statsArray.map(stat => (
              <TableRow key={stat.subjectId}>
                <TableCell>{stat.subjectName}</TableCell>
                <TableCell className="text-right">{stat.present}</TableCell>
                <TableCell className="text-right">{stat.absent}</TableCell>
                <TableCell className="text-right">{stat.total}</TableCell>
                <TableCell className="text-right">
                  <span className={
                    stat.percentage >= 75 ? 'text-green-600' : 
                    stat.percentage >= 60 ? 'text-amber-600' : 
                    'text-red-600'
                  }>
                    {stat.percentage.toFixed(1)}%
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                No attendance data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SubjectAttendance;
