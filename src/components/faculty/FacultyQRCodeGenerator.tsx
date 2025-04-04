
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

const FacultyQRCodeGenerator = () => {
  const { subjects, departments, getDepartmentSubjects } = useData();
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  
  // Get subjects for selected department
  const departmentSubjects = selectedDepartment
    ? getDepartmentSubjects(selectedDepartment)
    : [];
  
  // Periods 1-8
  const periods = Array.from({ length: 8 }, (_, i) => i + 1);
  
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate QR Code</CardTitle>
          <CardDescription>
            Create a unique QR code for attendance
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
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Period</label>
            <Select
              value={selectedPeriod}
              onValueChange={setSelectedPeriod}
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
          >
            Display QR Code
          </Button>
        </CardFooter>
      </Card>
      
      {selectedSubject && selectedPeriod && (
        <div className="flex items-center justify-center">
          <QRGenerator 
            subjectId={selectedSubject} 
            period={parseInt(selectedPeriod)} 
          />
        </div>
      )}
    </div>
  );
};

export default FacultyQRCodeGenerator;
