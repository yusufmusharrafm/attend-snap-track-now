
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

// Types for our data
export interface Department {
  id: string;
  name: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  deviceId?: string;
  attendancePercentage?: number;
  lastAttendance?: string;
  photoUrl?: string;
}

export interface Class {
  id: string;
  name: string;
  departmentId: string;
  subjects: Subject[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subjectId: string;
  date: string;
  present: boolean;
}

// Context type
interface DataContextType {
  departments: Department[];
  students: Student[];
  classes: Class[];
  subjects: Subject[];
  attendanceRecords: AttendanceRecord[];
  addDepartment: (department: Omit<Department, 'id'>) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  getDepartmentName: (departmentId: string) => string;
  getDepartmentStudents: (departmentId: string) => Student[];
  getDepartmentSubjects: (departmentId: string) => Subject[];
  getStudentAttendance: (studentId: string, startDate: string, endDate: string) => AttendanceRecord[];
  getSubjectAttendance: (subjectId: string) => AttendanceRecord[];
  getStudentName: (studentId: string) => string;
  getSubjectName: (subjectId: string) => string;
  recordAttendance: (studentId: string, subjectId: string, present: boolean) => void;
}

// Create context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial mock data
const initialDepartments: Department[] = [
  { id: 'dept1', name: 'Computer Science' },
  { id: 'dept2', name: 'Electronics' },
  { id: 'dept3', name: 'Mechanical' },
];

const initialStudents: Student[] = [
  {
    id: 'stud1',
    name: 'John Doe',
    email: 'john@example.com',
    departmentId: 'dept1',
    attendancePercentage: 85,
    lastAttendance: '2023-04-01',
    photoUrl: '/placeholder.svg'
  },
  {
    id: 'stud2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    departmentId: 'dept2',
    attendancePercentage: 92,
    lastAttendance: '2023-04-02',
    photoUrl: '/placeholder.svg'
  },
  {
    id: 'stud3',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    departmentId: 'dept1',
    attendancePercentage: 78,
    lastAttendance: '2023-03-28',
    photoUrl: '/placeholder.svg'
  },
];

const initialClasses: Class[] = [
  {
    id: 'class1',
    name: 'First Year CS',
    departmentId: 'dept1',
    subjects: [
      { id: 'sub1', name: 'Introduction to Programming', code: 'CS101' },
      { id: 'sub2', name: 'Data Structures', code: 'CS102' }
    ]
  },
  {
    id: 'class2',
    name: 'Second Year CS',
    departmentId: 'dept1',
    subjects: [
      { id: 'sub3', name: 'Algorithms', code: 'CS201' },
      { id: 'sub4', name: 'Database Systems', code: 'CS202' }
    ]
  },
  {
    id: 'class3',
    name: 'First Year Electronics',
    departmentId: 'dept2',
    subjects: [
      { id: 'sub5', name: 'Circuit Theory', code: 'EC101' },
      { id: 'sub6', name: 'Digital Electronics', code: 'EC102' }
    ]
  }
];

// Create initial attendance records
const initialAttendanceRecords: AttendanceRecord[] = [
  // For student 1
  { id: 'att1', studentId: 'stud1', subjectId: 'sub1', date: '2025-04-01', present: true },
  { id: 'att2', studentId: 'stud1', subjectId: 'sub2', date: '2025-04-01', present: true },
  { id: 'att3', studentId: 'stud1', subjectId: 'sub1', date: '2025-04-02', present: false },
  { id: 'att4', studentId: 'stud1', subjectId: 'sub2', date: '2025-04-02', present: true },
  { id: 'att5', studentId: 'stud1', subjectId: 'sub1', date: '2025-04-03', present: true },
  { id: 'att6', studentId: 'stud1', subjectId: 'sub2', date: '2025-04-03', present: true },
  { id: 'att7', studentId: 'stud1', subjectId: 'sub1', date: '2025-04-04', present: true },
  { id: 'att8', studentId: 'stud1', subjectId: 'sub2', date: '2025-04-04', present: false },
  
  // For student 2
  { id: 'att9', studentId: 'stud2', subjectId: 'sub5', date: '2025-04-01', present: true },
  { id: 'att10', studentId: 'stud2', subjectId: 'sub6', date: '2025-04-01', present: true },
  { id: 'att11', studentId: 'stud2', subjectId: 'sub5', date: '2025-04-02', present: true },
  { id: 'att12', studentId: 'stud2', subjectId: 'sub6', date: '2025-04-02', present: true },
  { id: 'att13', studentId: 'stud2', subjectId: 'sub5', date: '2025-04-03', present: false },
  { id: 'att14', studentId: 'stud2', subjectId: 'sub6', date: '2025-04-03', present: true },
  { id: 'att15', studentId: 'stud2', subjectId: 'sub5', date: '2025-04-04', present: true },
  { id: 'att16', studentId: 'stud2', subjectId: 'sub6', date: '2025-04-04', present: true },
  
  // For student 3
  { id: 'att17', studentId: 'stud3', subjectId: 'sub1', date: '2025-04-01', present: false },
  { id: 'att18', studentId: 'stud3', subjectId: 'sub2', date: '2025-04-01', present: true },
  { id: 'att19', studentId: 'stud3', subjectId: 'sub1', date: '2025-04-02', present: true },
  { id: 'att20', studentId: 'stud3', subjectId: 'sub2', date: '2025-04-02', present: false },
  { id: 'att21', studentId: 'stud3', subjectId: 'sub1', date: '2025-04-03', present: true },
  { id: 'att22', studentId: 'stud3', subjectId: 'sub2', date: '2025-04-03', present: true },
  { id: 'att23', studentId: 'stud3', subjectId: 'sub1', date: '2025-04-04', present: false },
  { id: 'att24', studentId: 'stud3', subjectId: 'sub2', date: '2025-04-04', present: true },
];

// Provider component
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialAttendanceRecords);
  
  // Extract all subjects from classes
  const subjects = classes.flatMap(cls => cls.subjects);

  // Add a new department
  const addDepartment = (department: Omit<Department, 'id'>) => {
    const newDepartment = {
      ...department,
      id: `dept${departments.length + 1}`,
    };
    
    setDepartments([...departments, newDepartment]);
    toast.success(`Department "${department.name}" added successfully`);
  };

  // Add a new student
  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = {
      ...student,
      id: `stud${students.length + 1}`,
      attendancePercentage: 0,
      lastAttendance: '',
      photoUrl: '/placeholder.svg'
    };
    
    setStudents([...students, newStudent]);
    toast.success(`Student "${student.name}" added successfully`);
  };

  // Helper to get department name by ID
  const getDepartmentName = (departmentId: string): string => {
    const department = departments.find(d => d.id === departmentId);
    return department ? department.name : 'Unknown Department';
  };

  // Helper to get students by department ID
  const getDepartmentStudents = (departmentId: string): Student[] => {
    return students.filter(student => student.departmentId === departmentId);
  };
  
  // Helper to get subjects by department ID
  const getDepartmentSubjects = (departmentId: string): Subject[] => {
    const departmentClasses = classes.filter(cls => cls.departmentId === departmentId);
    return departmentClasses.flatMap(cls => cls.subjects);
  };
  
  // Helper to get student attendance records
  const getStudentAttendance = (studentId: string, startDate: string, endDate: string): AttendanceRecord[] => {
    return attendanceRecords.filter(record => 
      record.studentId === studentId && 
      record.date >= startDate && 
      record.date <= endDate
    );
  };
  
  // Helper to get attendance records for a subject
  const getSubjectAttendance = (subjectId: string): AttendanceRecord[] => {
    return attendanceRecords.filter(record => record.subjectId === subjectId);
  };
  
  // Helper to get student name by ID
  const getStudentName = (studentId: string): string => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };
  
  // Helper to get subject name by ID
  const getSubjectName = (subjectId: string): string => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };
  
  // Record attendance
  const recordAttendance = (studentId: string, subjectId: string, present: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    const newAttendance = {
      id: `att${attendanceRecords.length + 1}`,
      studentId,
      subjectId,
      date: today,
      present
    };
    
    setAttendanceRecords([...attendanceRecords, newAttendance]);
    
    const studentName = getStudentName(studentId);
    const subjectName = getSubjectName(subjectId);
    
    toast.success(`Attendance recorded for ${studentName} in ${subjectName}`);
  };

  const contextValue = {
    departments,
    students,
    classes,
    subjects,
    attendanceRecords,
    addDepartment,
    addStudent,
    getDepartmentName,
    getDepartmentStudents,
    getDepartmentSubjects,
    getStudentAttendance,
    getSubjectAttendance,
    getStudentName,
    getSubjectName,
    recordAttendance,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

// Hook for using the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
