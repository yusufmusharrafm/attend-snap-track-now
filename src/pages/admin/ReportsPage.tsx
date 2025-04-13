
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { Download, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Mock data for reports
const attendanceData = [
  { id: 1, name: 'John Smith', department: 'Computer Science', date: '2025-04-10', status: 'Present', time: '09:15 AM' },
  { id: 2, name: 'Emily Johnson', department: 'Computer Science', date: '2025-04-10', status: 'Present', time: '09:10 AM' },
  { id: 3, name: 'Michael Brown', department: 'Electrical Engineering', date: '2025-04-10', status: 'Absent', time: '-' },
  { id: 4, name: 'Sarah Wilson', department: 'Mechanical Engineering', date: '2025-04-10', status: 'Present', time: '09:22 AM' },
  { id: 5, name: 'David Taylor', department: 'Civil Engineering', date: '2025-04-10', status: 'Late', time: '09:45 AM' },
  { id: 6, name: 'Jessica Martinez', department: 'Physics', date: '2025-04-10', status: 'Present', time: '09:08 AM' },
  { id: 7, name: 'James Anderson', department: 'Computer Science', date: '2025-04-11', status: 'Present', time: '09:12 AM' },
  { id: 8, name: 'Robert Thomas', department: 'Electrical Engineering', date: '2025-04-11', status: 'Present', time: '09:05 AM' },
  { id: 9, name: 'Jennifer White', department: 'Mechanical Engineering', date: '2025-04-11', status: 'Absent', time: '-' },
  { id: 10, name: 'Lisa Harris', department: 'Physics', date: '2025-04-11', status: 'Present', time: '09:18 AM' },
];

const ReportsPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  // Check if user is admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  // Filter data based on selected department
  const filteredData = selectedDepartment === "all" 
    ? attendanceData
    : attendanceData.filter(item => item.department === selectedDepartment);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance Reports</h1>
        <p className="text-muted-foreground">
          Generate and view detailed attendance reports.
        </p>
      </div>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="daily">Daily Report</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Summary</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Attendance Report</CardTitle>
              <CardDescription>View and export daily attendance data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal md:w-[240px]"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-full md:w-[240px]">
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                      <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                      <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="ml-auto" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.department}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            item.status === "Present" && "bg-green-100 text-green-800",
                            item.status === "Absent" && "bg-red-100 text-red-800",
                            item.status === "Late" && "bg-yellow-100 text-yellow-800"
                          )}>
                            {item.status}
                          </span>
                        </TableCell>
                        <TableCell>{item.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Attendance Summary</CardTitle>
              <CardDescription>Aggregated data for weekly reporting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center p-12 text-muted-foreground">
                Weekly report view will be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance Analysis</CardTitle>
              <CardDescription>Long-term attendance trends and patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center p-12 text-muted-foreground">
                Monthly report view will be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
