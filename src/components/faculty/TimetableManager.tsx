
import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import {
  Card,
  CardContent,
  CardDescription,
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
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Clock, FileUp, Plus, Save } from 'lucide-react';

const TimetableManager = () => {
  const { 
    departments, 
    classes, 
    subjects, 
    timetable,
    getClassTimetable, 
    addTimetableEntry,
    getDepartmentName
  } = useData();
  
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  
  // New timetable entry state
  const [newEntry, setNewEntry] = useState({
    classId: '',
    dayOfWeek: 1, // Monday by default
    period: 1,
    subjectId: '',
  });
  
  // Filter classes by department
  const departmentClasses = selectedDepartment 
    ? classes.filter(c => c.departmentId === selectedDepartment)
    : [];
  
  // Get timetable for selected class
  const classTimetable = selectedClass
    ? getClassTimetable(selectedClass)
    : [];
  
  // Group timetable by day of week
  const timetableByDay = classTimetable.reduce((acc, entry) => {
    if (!acc[entry.dayOfWeek]) {
      acc[entry.dayOfWeek] = [];
    }
    acc[entry.dayOfWeek].push(entry);
    return acc;
  }, {} as Record<number, typeof classTimetable>);
  
  // Days of week
  const daysOfWeek = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];
  
  // Handle adding new timetable entry
  const handleAddEntry = () => {
    if (!newEntry.classId || !newEntry.subjectId) {
      toast.error('Please select class and subject');
      return;
    }
    
    addTimetableEntry(newEntry);
    setIsAddingEntry(false);
    setNewEntry({
      classId: selectedClass,
      dayOfWeek: 1,
      period: 1,
      subjectId: '',
    });
  };
  
  // Handle file upload (simulated)
  const handleFileUpload = () => {
    toast.info('Timetable upload feature will be implemented when connected to backend');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Timetable Management</CardTitle>
          <CardDescription>
            View and edit class timetables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select
                value={selectedDepartment}
                onValueChange={(value) => {
                  setSelectedDepartment(value);
                  setSelectedClass('');
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
              <label className="text-sm font-medium">Class</label>
              <Select
                value={selectedClass}
                onValueChange={setSelectedClass}
                disabled={!selectedDepartment}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    selectedDepartment 
                      ? "Select Class" 
                      : "Select a department first"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {departmentClasses.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} - Year {cls.year}, Section {cls.section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setIsAddingEntry(!isAddingEntry)}
              disabled={!selectedClass}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
            
            <Button variant="outline" onClick={handleFileUpload}>
              <FileUp className="h-4 w-4 mr-2" />
              Upload Timetable
            </Button>
          </div>
          
          {isAddingEntry && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-md border bg-muted/50">
              <Select
                value={newEntry.dayOfWeek.toString()}
                onValueChange={(value) => setNewEntry(prev => ({ ...prev, dayOfWeek: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={newEntry.period.toString()}
                onValueChange={(value) => setNewEntry(prev => ({ ...prev, period: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 8 }, (_, i) => i + 1).map(period => (
                    <SelectItem key={period} value={period.toString()}>
                      Period {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={newEntry.subjectId}
                onValueChange={(value) => setNewEntry(prev => ({ ...prev, subjectId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button onClick={handleAddEntry} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="ghost" onClick={() => setIsAddingEntry(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          {selectedClass && Object.keys(timetableByDay).length > 0 ? (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Current Timetable</h3>
              
              {Object.entries(timetableByDay).map(([day, entries]) => {
                const dayNum = parseInt(day);
                return (
                  <div key={day} className="mb-6">
                    <h4 className="font-medium mb-2">{daysOfWeek[dayNum]}</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Period</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Subject</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {entries
                          .sort((a, b) => a.period - b.period)
                          .map(entry => {
                            const subject = subjects.find(s => s.id === entry.subjectId);
                            // Map period to time
                            const periodTimes = [
                              "8:00 - 8:55 AM",
                              "9:00 - 9:55 AM",
                              "10:00 - 10:55 AM",
                              "11:00 - 11:55 AM",
                              "12:00 - 12:55 PM",
                              "2:00 - 2:55 PM",
                              "3:00 - 3:55 PM",
                              "4:00 - 4:55 PM"
                            ];
                            
                            return (
                              <TableRow key={entry.id}>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>Period {entry.period}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{periodTimes[entry.period - 1]}</TableCell>
                                <TableCell>{subject?.name || "Unknown Subject"}</TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </div>
                );
              })}
            </div>
          ) : selectedClass ? (
            <div className="py-8 text-center text-muted-foreground">
              No timetable entries found for this class. Add some entries to get started.
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              Select a department and class to view or edit the timetable.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimetableManager;
