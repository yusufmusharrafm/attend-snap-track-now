
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

// Context type
interface DataContextType {
  departments: Department[];
  students: Student[];
  classes: Class[];
  addDepartment: (department: Omit<Department, 'id'>) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  getDepartmentName: (departmentId: string) => string;
  getDepartmentStudents: (departmentId: string) => Student[];
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

// Provider component
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [classes, setClasses] = useState<Class[]>(initialClasses);

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

  const contextValue = {
    departments,
    students,
    classes,
    addDepartment,
    addStudent,
    getDepartmentName,
    getDepartmentStudents,
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
