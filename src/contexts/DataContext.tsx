
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

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
  photoUrl?: string;
}

export interface Subject {
  id: string;
  name: string;
  departmentId: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subjectId: string;
  date: string; // YYYY-MM-DD
  period: number; // 1-8
  present: boolean;
  scannedAt?: string; // ISO date string
  wifiVerified: boolean;
}

interface DataContextType {
  departments: Department[];
  students: Student[];
  subjects: Subject[];
  attendanceRecords: AttendanceRecord[];
  addDepartment: (department: Omit<Department, 'id'>) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  recordAttendance: (studentId: string, subjectId: string, period: number, wifiVerified: boolean) => void;
  getStudentAttendance: (studentId: string, startDate?: string, endDate?: string) => AttendanceRecord[];
  getSubjectAttendance: (subjectId: string, date?: string) => AttendanceRecord[];
  getDepartmentStudents: (departmentId: string) => Student[];
  getDepartmentSubjects: (departmentId: string) => Subject[];
  getDepartmentName: (departmentId: string) => string;
  getSubjectName: (subjectId: string) => string;
  getStudentName: (studentId: string) => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const mockDepartments: Department[] = [
  { id: 'd1', name: 'Computer Science' },
  { id: 'd2', name: 'Electrical Engineering' },
  { id: 'd3', name: 'Mechanical Engineering' }
];

const mockStudents: Student[] = [
  { id: 's1', name: 'John Doe', email: 'john@student.edu', departmentId: 'd1', photoUrl: '/placeholder.svg' },
  { id: 's2', name: 'Jane Smith', email: 'jane@student.edu', departmentId: 'd1', photoUrl: '/placeholder.svg' },
  { id: 's3', name: 'Alice Johnson', email: 'alice@student.edu', departmentId: 'd2', photoUrl: '/placeholder.svg' },
  { id: 's4', name: 'Bob Brown', email: 'bob@student.edu', departmentId: 'd3', photoUrl: '/placeholder.svg' }
];

const mockSubjects: Subject[] = [
  { id: 'sub1', name: 'Introduction to Programming', departmentId: 'd1' },
  { id: 'sub2', name: 'Data Structures', departmentId: 'd1' },
  { id: 'sub3', name: 'Circuit Theory', departmentId: 'd2' },
  { id: 'sub4', name: 'Thermodynamics', departmentId: 'd3' }
];

// Generate some random attendance records for the last 7 days
const generateMockAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    mockStudents.forEach(student => {
      // Find subjects for this student's department
      const deptSubjects = mockSubjects.filter(sub => sub.departmentId === student.departmentId);
      
      deptSubjects.forEach(subject => {
        // Generate records for periods 1-8
        for (let period = 1; period <= 8; period++) {
          // Make some random attendance (70% chance of being present)
          const present = Math.random() > 0.3;
          records.push({
            id: `ar-${student.id}-${subject.id}-${dateString}-${period}`,
            studentId: student.id,
            subjectId: subject.id,
            date: dateString,
            period,
            present,
            scannedAt: present ? new Date(date.setHours(8 + period)).toISOString() : undefined,
            wifiVerified: present
          });
        }
      });
    });
  }
  
  return records;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // Initialize with mock data
  useEffect(() => {
    setAttendanceRecords(generateMockAttendance());
  }, []);

  const addDepartment = (department: Omit<Department, 'id'>) => {
    const newDepartment = {
      id: `d${departments.length + 1}`,
      ...department
    };
    setDepartments([...departments, newDepartment]);
    toast.success(`Department ${department.name} added`);
  };

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = {
      id: `s${students.length + 1}`,
      ...student
    };
    setStudents([...students, newStudent]);
    toast.success(`Student ${student.name} added`);
  };

  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject = {
      id: `sub${subjects.length + 1}`,
      ...subject
    };
    setSubjects([...subjects, newSubject]);
    toast.success(`Subject ${subject.name} added`);
  };

  const recordAttendance = (studentId: string, subjectId: string, period: number, wifiVerified: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    const existingRecord = attendanceRecords.find(
      r => r.studentId === studentId && 
           r.subjectId === subjectId && 
           r.date === today && 
           r.period === period
    );
    
    if (existingRecord) {
      // Update existing record
      const updatedRecords = attendanceRecords.map(record => {
        if (record.id === existingRecord.id) {
          return {
            ...record,
            present: true,
            scannedAt: new Date().toISOString(),
            wifiVerified
          };
        }
        return record;
      });
      setAttendanceRecords(updatedRecords);
    } else {
      // Create new record
      const newRecord: AttendanceRecord = {
        id: `ar-${studentId}-${subjectId}-${today}-${period}`,
        studentId,
        subjectId,
        date: today,
        period,
        present: true,
        scannedAt: new Date().toISOString(),
        wifiVerified
      };
      setAttendanceRecords([...attendanceRecords, newRecord]);
    }
    
    toast.success('Attendance recorded successfully');
  };

  const getStudentAttendance = (studentId: string, startDate?: string, endDate?: string) => {
    let filtered = attendanceRecords.filter(record => record.studentId === studentId);
    
    if (startDate) {
      filtered = filtered.filter(record => record.date >= startDate);
    }
    
    if (endDate) {
      filtered = filtered.filter(record => record.date <= endDate);
    }
    
    return filtered;
  };

  const getSubjectAttendance = (subjectId: string, date?: string) => {
    let filtered = attendanceRecords.filter(record => record.subjectId === subjectId);
    
    if (date) {
      filtered = filtered.filter(record => record.date === date);
    }
    
    return filtered;
  };

  const getDepartmentStudents = (departmentId: string) => {
    return students.filter(student => student.departmentId === departmentId);
  };

  const getDepartmentSubjects = (departmentId: string) => {
    return subjects.filter(subject => subject.departmentId === departmentId);
  };

  const getDepartmentName = (departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    return department ? department.name : 'Unknown Department';
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(sub => sub.id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  return (
    <DataContext.Provider
      value={{
        departments,
        students,
        subjects,
        attendanceRecords,
        addDepartment,
        addStudent,
        addSubject,
        recordAttendance,
        getStudentAttendance,
        getSubjectAttendance,
        getDepartmentStudents,
        getDepartmentSubjects,
        getDepartmentName,
        getSubjectName,
        getStudentName
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
