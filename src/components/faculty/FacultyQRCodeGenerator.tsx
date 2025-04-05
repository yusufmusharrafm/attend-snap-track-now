
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import QRGenerator from '@/components/QRCodeGenerator';
import AttendanceInfo from '@/components/faculty/AttendanceInfo';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const FacultyQRCodeGenerator = () => {
  const { subjects, departments, getDepartmentSubjects, getSubjectAttendance } = useData();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  
  // Get subjects for selected department
  const departmentSubjects = selectedDepartment
    ? getDepartmentSubjects(selectedDepartment)
    : [];
  
  // Periods 1-8
  const periods = Array.from({ length: 8 }, (_, i) => i + 1);
  
  // Get current attendance data for the selected subject
  const attendanceData = selectedSubject
    ? getSubjectAttendance(selectedSubject)
    : [];
    
  // Calculate today's date
  const today = new Date().toISOString().split('T')[0];
  
  // Filter for today's attendance
  const todaysAttendance = attendanceData.filter(record => record.date === today);
  
  // Present count for today
  const presentCount = todaysAttendance.filter(record => record.present).length;
  
  // Total students count (could be retrieved from the context)
  const totalStudents = 25; // This is a mock value, replace with actual total when backend is integrated
  
  const handleGenerateQR = () => {
    setIsGeneratingQR(true);
  };
  
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate QR Code</CardTitle>
          <CardDescription>
            Create a secure QR code for attendance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Department</label>
            <Select
              value={selectedDepartment}
              onValueChange={(value) => {
                setSelectedDepartment(value);
                setSelectedSubject('');
                setIsGeneratingQR(false);
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
              onValueChange={(value) => {
                setSelectedSubject(value);
                setIsGeneratingQR(false);
              }}
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
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Period</label>
            <Select
              value={selectedPeriod}
              onValueChange={(value) => {
                setSelectedPeriod(value);
                setIsGeneratingQR(false);
              }}
              disabled={!selectedSubject}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  selectedSubject 
                    ? "Select Period" 
                    : "Select a subject first"
                } />
              </SelectTrigger>
              <SelectContent>
                {periods.map(period => (
                  <SelectItem key={period} value={period.toString()}>
                    Period {period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full"
            disabled={!selectedDepartment || !selectedSubject || !selectedPeriod}
            onClick={handleGenerateQR}
          >
            Display QR Code
          </Button>
        </CardFooter>
      </Card>
      
      {isGeneratingQR && selectedSubject && selectedPeriod && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center justify-center">
            <QRGenerator 
              subjectId={selectedSubject} 
              period={parseInt(selectedPeriod)} 
              validitySeconds={45} // Set to 45 seconds as requested
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Attendance Status</CardTitle>
              <CardDescription>
                Real-time attendance tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AttendanceInfo 
                subjectId={selectedSubject}
                presentCount={presentCount}
                totalCount={totalStudents}
              />
              
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  QR codes are valid for 45 seconds only. Students must scan while connected to campus WiFi.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FacultyQRCodeGenerator;
