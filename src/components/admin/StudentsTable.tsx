
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Check, X } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const StudentsTable = () => {
  const { 
    students, 
    departments, 
    addStudent, 
    getDepartmentName
  } = useData();
  
  const { canManageAllStudents, canManageFacultyStudents, user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  
  // New student form state
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    departmentId: '',
    rollNumber: '',
    year: 1,
    section: 'A',
    phoneNumber: ''
  });
  
  // Filter students based on search query, selected department, and user permissions
  const filteredStudents = students.filter(student => {
    // Filter by search query
    const matchesSearch = searchQuery 
      ? student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    // Filter by department
    const matchesDepartment = selectedDepartment === 'all' || student.departmentId === selectedDepartment;
    
    // Filter by user permissions
    const hasPermission = canManageAllStudents || 
      (canManageFacultyStudents && user?.department === student.departmentId);
    
    return matchesSearch && matchesDepartment && hasPermission;
  });
  
  const handleAddStudent = () => {
    // Check permission
    if (!canManageAllStudents && 
        !(canManageFacultyStudents && user?.department === newStudent.departmentId)) {
      toast.error("You don't have permission to add students to this department");
      return;
    }

    // Validate form
    if (!newStudent.name.trim() || !newStudent.email.trim() || !newStudent.departmentId || 
        !newStudent.rollNumber.trim() || !newStudent.phoneNumber.trim()) {
      toast.error('All fields are required');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newStudent.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // Check if email already exists
    if (students.some(s => s.email.toLowerCase() === newStudent.email.toLowerCase())) {
      toast.error('A student with this email already exists');
      return;
    }
    
    // Check if roll number already exists
    if (students.some(s => s.rollNumber.toLowerCase() === newStudent.rollNumber.toLowerCase())) {
      toast.error('A student with this roll number already exists');
      return;
    }
    
    // Validate phone number (simple validation)
    if (!/^\+?[\d\s-]{10,15}$/.test(newStudent.phoneNumber)) {
      toast.error('Please enter a valid phone number');
      return;
    }
    
    // Add student
    addStudent(newStudent);
    
    // Reset form
    setNewStudent({
      name: '',
      email: '',
      departmentId: '',
      rollNumber: '',
      year: 1,
      section: 'A',
      phoneNumber: ''
    });
    setIsAdding(false);
  };
  
  // Filter departments based on user permissions
  const availableDepartments = departments.filter(dept => 
    canManageAllStudents || (canManageFacultyStudents && user?.department === dept.id)
  );
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-1 w-full gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {(canManageAllStudents || canManageFacultyStudents) && (
          <Button onClick={() => setIsAdding(!isAdding)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        )}
      </div>
      
      {isAdding && (canManageAllStudents || canManageFacultyStudents) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-md border bg-muted/50">
          <Input
            placeholder="Full Name"
            value={newStudent.name}
            onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
          />
          <Input
            placeholder="Email Address"
            type="email"
            value={newStudent.email}
            onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
          />
          <Input
            placeholder="Roll Number (e.g. CSE001)"
            value={newStudent.rollNumber}
            onChange={(e) => setNewStudent(prev => ({ ...prev, rollNumber: e.target.value }))}
          />
          <Select
            value={newStudent.departmentId}
            onValueChange={(value) => setNewStudent(prev => ({ ...prev, departmentId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {availableDepartments.map(dept => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(newStudent.year)}
            onValueChange={(value) => setNewStudent(prev => ({ ...prev, year: Number(value) }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1st Year</SelectItem>
              <SelectItem value="2">2nd Year</SelectItem>
              <SelectItem value="3">3rd Year</SelectItem>
              <SelectItem value="4">4th Year</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={newStudent.section}
            onValueChange={(value) => setNewStudent(prev => ({ ...prev, section: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Section A</SelectItem>
              <SelectItem value="B">Section B</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Phone Number (e.g. +91 9876543210)"
            value={newStudent.phoneNumber}
            onChange={(e) => setNewStudent(prev => ({ ...prev, phoneNumber: e.target.value }))}
          />
          <div className="flex gap-2 md:col-span-3">
            <Button onClick={handleAddStudent}>Add Student</Button>
            <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
          </div>
        </div>
      )}
      
      <Table>
        <TableCaption>List of all registered students</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Roll Number</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Year & Section</TableHead>
            <TableHead>Device Verified</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map(student => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.rollNumber}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{getDepartmentName(student.departmentId)}</TableCell>
                <TableCell>Year {student.year}, Section {student.section}</TableCell>
                <TableCell>
                  {student.deviceId ? (
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-xs text-muted-foreground">Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <X className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-xs text-muted-foreground">Not Verified</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View</Button>
                  {(canManageAllStudents || 
                    (canManageFacultyStudents && user?.department === student.departmentId)) && (
                    <Button variant="ghost" size="sm">Edit</Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                {searchQuery || selectedDepartment !== 'all'
                  ? 'No students found matching your search'
                  : 'No students added yet'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentsTable;
