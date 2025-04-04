
import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

const StudentPhotoGallery = () => {
  const { departments, getDepartmentStudents, getStudentAttendance } = useData();
  const [selectedDepartment, setSelectedDepartment] = useState('');

  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  
  // Get students for the selected department
  const students = selectedDepartment ? getDepartmentStudents(selectedDepartment) : [];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4">
          <Select 
            value={selectedDepartment} 
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map(department => (
                <SelectItem key={department.id} value={department.id}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedDepartment && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {students.length > 0 ? (
              students.map(student => {
                // Get today's attendance for this student
                const todayAttendance = getStudentAttendance(student.id, today, today);
                const presentToday = todayAttendance.some(record => record.present);
                
                return (
                  <div key={student.id} className="flex flex-col items-center p-3 border rounded-lg text-center">
                    <Avatar className="h-16 w-16 mb-2">
                      <AvatarImage src={student.photoUrl || "/placeholder.svg"} alt={student.name} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-medium text-sm">{student.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{student.email}</p>
                    
                    <Badge 
                      variant={presentToday ? "success" : "destructive"}
                      className="flex items-center gap-1"
                    >
                      {presentToday ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          <span>Present</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" />
                          <span>Absent</span>
                        </>
                      )}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <p className="col-span-full text-center py-4 text-muted-foreground">
                No students found in this department
              </p>
            )}
          </div>
        )}

        {!selectedDepartment && (
          <div className="py-8 text-center text-muted-foreground">
            Select a department to view students
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentPhotoGallery;
