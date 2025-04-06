import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

// Types for our data
export interface Department {
  id: string;
  name: string;
  code: string; // Added department code
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
  rollNumber: string; // Added roll number
  year: number; // Added year (1-4)
  section: string; // Added section (A or B)
  phoneNumber: string; // Added phone number
}

export interface Class {
  id: string;
  name: string;
  departmentId: string;
  year: number; // Added year
  section: string; // Added section
  subjects: Subject[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  facultyId?: string; // Added facultyId for optional faculty feature
}

export interface Timetable {
  id: string;
  classId: string;
  dayOfWeek: number; // 0-6 (Sunday to Saturday)
  period: number; // 1-8
  subjectId: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subjectId: string;
  date: string;
  period: number; // Added period number
  present: boolean;
  timeOfScan?: string; // Added time of scan
  deviceId?: string; // Added device ID used
  wifiStatus?: boolean; // Added WiFi status
}

// Context type
interface DataContextType {
  departments: Department[];
  students: Student[];
  classes: Class[];
  subjects: Subject[];
  attendanceRecords: AttendanceRecord[];
  timetable: Timetable[];
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
  getClassTimetable: (classId: string) => Timetable[];
  getCurrentPeriodSubject: (classId: string) => string | null;
  addTimetableEntry: (entry: Omit<Timetable, 'id'>) => void;
}

// Create context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Updated initial mock data
const initialDepartments: Department[] = [
  { id: 'dept1', name: 'Computer Science and Engineering', code: 'CSE' },
  { id: 'dept2', name: 'Electronics and Communication Engineering', code: 'ECE' },
  { id: 'dept3', name: 'Mechanical Engineering', code: 'ME' },
  { id: 'dept4', name: 'CSE – Artificial Intelligence and Machine Learning', code: 'CSE-AIML' },
  { id: 'dept5', name: 'CSE – Cyber Security', code: 'CSE-CS' },
  { id: 'dept6', name: 'Information Technology', code: 'IT' },
  { id: 'dept7', name: 'Artificial Intelligence and Data Sciences', code: 'AIDS' },
  { id: 'dept8', name: 'Computer Science and Business Systems', code: 'CSBS' },
];

const initialStudents: Student[] = [
  {
    id: 'stud1',
    name: 'John Doe',
    email: 'john@example.com',
    departmentId: 'dept1',
    attendancePercentage: 85,
    lastAttendance: '2023-04-01',
    photoUrl: '/placeholder.svg',
    rollNumber: 'CSE001',
    year: 3,
    section: 'A',
    phoneNumber: '+91 9876543201'
  },
  {
    id: 'stud2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    departmentId: 'dept2',
    attendancePercentage: 92,
    lastAttendance: '2023-04-02',
    photoUrl: '/placeholder.svg',
    rollNumber: 'ECE001',
    year: 2,
    section: 'B',
    phoneNumber: '+91 9876543202'
  },
  {
    id: 'stud3',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    departmentId: 'dept1',
    attendancePercentage: 78,
    lastAttendance: '2023-03-28',
    photoUrl: '/placeholder.svg',
    rollNumber: 'CSE002',
    year: 3,
    section: 'A',
    phoneNumber: '+91 9876543203'
  },
];

const initialClasses: Class[] = [
  {
    id: 'class1',
    name: 'First Year CS',
    departmentId: 'dept1',
    year: 1,
    section: 'A',
    subjects: [
      { id: 'sub1', name: 'Introduction to Programming', code: 'CS101' },
      { id: 'sub2', name: 'Data Structures', code: 'CS102' }
    ]
  },
  {
    id: 'class2',
    name: 'Second Year CS',
    departmentId: 'dept1',
    year: 2,
    section: 'A',
    subjects: [
      { id: 'sub3', name: 'Algorithms', code: 'CS201' },
      { id: 'sub4', name: 'Database Systems', code: 'CS202' }
    ]
  },
  {
    id: 'class3',
    name: 'First Year Electronics',
    departmentId: 'dept2',
    year: 1,
    section: 'A',
    subjects: [
      { id: 'sub5', name: 'Circuit Theory', code: 'EC101' },
      { id: 'sub6', name: 'Digital Electronics', code: 'EC102' }
    ]
  }
];

// Create initial attendance records
const initialAttendanceRecords: AttendanceRecord[] = [
  // For student 1
  { id: 'att1', studentId: 'stud1', subjectId: 'sub1', date: '2025-04-01', period: 1, present: true },
  { id: 'att2', studentId: 'stud1', subjectId: 'sub2', date: '2025-04-01', period: 2, present: true },
  { id: 'att3', studentId: 'stud1', subjectId: 'sub1', date: '2025-04-02', period: 1, present: false },
  { id: 'att4', studentId: 'stud1', subjectId: 'sub2', date: '2025-04-02', period: 2, present: true },
  { id: 'att5', studentId: 'stud1', subjectId: 'sub1', date: '2025-04-03', period: 1, present: true },
  { id: 'att6', studentId: 'stud1', subjectId: 'sub2', date: '2025-04-03', period: 2, present: true },
  { id: 'att7', studentId: 'stud1', subjectId: 'sub1', date: '2025-04-04', period: 1, present: true },
  { id: 'att8', studentId: 'stud1', subjectId: 'sub2', date: '2025-04-04', period: 2, present: false },
  
  // For student 2
  { id: 'att9', studentId: 'stud2', subjectId: 'sub5', date: '2025-04-01', period: 1, present: true },
  { id: 'att10', studentId: 'stud2', subjectId: 'sub6', date: '2025-04-01', period: 2, present: true },
  { id: 'att11', studentId: 'stud2', subjectId: 'sub5', date: '2025-04-02', period: 1, present: true },
  { id: 'att12', studentId: 'stud2', subjectId: 'sub6', date: '2025-04-02', period: 2, present: true },
  { id: 'att13', studentId: 'stud2', subjectId: 'sub5', date: '2025-04-03', period: 1, present: false },
  { id: 'att14', studentId: 'stud2', subjectId: 'sub6', date: '2025-04-03', period: 2, present: true },
  { id: 'att15', studentId: 'stud2', subjectId: 'sub5', date: '2025-04-04', period: 1, present: true },
  { id: 'att16', studentId: 'stud2', subjectId: 'sub6', date: '2025-04-04', period: 2, present: true },
  
  // For student 3
  { id: 'att17', studentId: 'stud3', subjectId: 'sub1', date: '2025-04-01', period: 1, present: false },
  { id: 'att18', studentId: 'stud3', subjectId: 'sub2', date: '2025-04-01', period: 2, present: true },
  { id: 'att19', studentId: 'stud3', subjectId: 'sub1', date: '2025-04-02', period: 1, present: true },
  { id: 'att20', studentId: 'stud3', subjectId: 'sub2', date: '2025-04-02', period: 2, present: false },
  { id: 'att21', studentId: 'stud3', subjectId: 'sub1', date: '2025-04-03', period: 1, present: true },
  { id: 'att22', studentId: 'stud3', subjectId: 'sub2', date: '2025-04-03', period: 2, present: true },
  { id: 'att23', studentId: 'stud3', subjectId: 'sub1', date: '2025-04-04', period: 1, present: false },
  { id: 'att24', studentId: 'stud3', subjectId: 'sub2', date: '2025-04-04', period: 2, present: true },
];

// New initial timetable data
const initialTimetable: Timetable[] = [
  { id: 'tt1', classId: 'class1', dayOfWeek: 1, period: 1, subjectId: 'sub1' },
  { id: 'tt2', classId: 'class1', dayOfWeek: 1, period: 2, subjectId: 'sub2' },
  { id: 'tt3', classId: 'class2', dayOfWeek: 1, period: 1, subjectId: 'sub3' },
  { id: 'tt4', classId: 'class2', dayOfWeek: 1, period: 2, subjectId: 'sub4' },
  { id: 'tt5', classId: 'class3', dayOfWeek: 1, period: 1, subjectId: 'sub5' },
  { id: 'tt6', classId: 'class3', dayOfWeek: 1, period: 2, subjectId: 'sub6' },
];

// Provider component
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialAttendanceRecords);
  const [timetable, setTimetable] = useState<Timetable[]>(initialTimetable);
  
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
  
  // Get timetable for a specific class
  const getClassTimetable = (classId: string): Timetable[] => {
    return timetable.filter(tt => tt.classId === classId);
  };
  
  // Get current period subject for a class
  const getCurrentPeriodSubject = (classId: string): string | null => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentHour = now.getHours();
    
    // Map hours to periods (simplified example)
    let currentPeriod = 0;
    if (currentHour >= 8 && currentHour < 9) currentPeriod = 1;
    else if (currentHour >= 9 && currentHour < 10) currentPeriod = 2;
    else if (currentHour >= 10 && currentHour < 11) currentPeriod = 3;
    else if (currentHour >= 11 && currentHour < 12) currentPeriod = 4;
    else if (currentHour >= 12 && currentHour < 13) currentPeriod = 5;
    else if (currentHour >= 14 && currentHour < 15) currentPeriod = 6;
    else if (currentHour >= 15 && currentHour < 16) currentPeriod = 7;
    else if (currentHour >= 16 && currentHour < 17) currentPeriod = 8;
    
    if (currentPeriod === 0) return null;
    
    const currentTimetableEntry = timetable.find(
      tt => tt.classId === classId && tt.dayOfWeek === dayOfWeek && tt.period === currentPeriod
    );
    
    return currentTimetableEntry ? currentTimetableEntry.subjectId : null;
  };
  
  // Add a new timetable entry
  const addTimetableEntry = (entry: Omit<Timetable, 'id'>) => {
    const newEntry = {
      ...entry,
      id: `tt${timetable.length + 1}`,
    };
    
    setTimetable([...timetable, newEntry]);
    toast.success('Timetable entry added successfully');
  };
  
  // Enhanced recordAttendance to include more data
  const recordAttendance = (studentId: string, subjectId: string, present: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const timeOfScan = now.toLocaleTimeString();
    
    // Determine current period based on time
    const currentHour = now.getHours();
    let period = 0;
    if (currentHour >= 8 && currentHour < 9) period = 1;
    else if (currentHour >= 9 && currentHour < 10) period = 2;
    else if (currentHour >= 10 && currentHour < 11) period = 3;
    else if (currentHour >= 11 && currentHour < 12) period = 4;
    else if (currentHour >= 12 && currentHour < 13) period = 5;
    else if (currentHour >= 14 && currentHour < 15) period = 6;
    else if (currentHour >= 15 && currentHour < 16) period = 7;
    else if (currentHour >= 16 && currentHour < 17) period = 8;
    
    // Get student's device ID
    const student = students.find(s => s.id === studentId);
    const deviceId = student?.deviceId || '';
    
    const newAttendance: AttendanceRecord = {
      id: `att${attendanceRecords.length + 1}`,
      studentId,
      subjectId,
      date: today,
      period,
      present,
      timeOfScan,
      deviceId,
      wifiStatus: present // if present is true, WiFi check passed
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
    timetable,
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
    getClassTimetable,
    getCurrentPeriodSubject,
    addTimetableEntry
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
