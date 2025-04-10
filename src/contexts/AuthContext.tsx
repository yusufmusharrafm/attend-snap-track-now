
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { api } from "@/lib/api";

export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  deviceId?: string;
  verified: boolean;
  photoUrl?: string;
  rollNumber?: string; // Added for students
  year?: number; // Added for students
  section?: string; // Added for students
  phoneNumber?: string; // Added for students
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  verifyDevice: () => Promise<boolean>;
  isAuthenticated: boolean;
  isFaculty: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo - these will be used as fallback if API is not available
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Faculty User',
    email: 'faculty@college.edu',
    role: 'faculty',
    department: 'dept1', // Computer Science
    verified: true,
    photoUrl: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'John Student',
    email: 'student@college.edu',
    role: 'student',
    department: 'dept1', // Computer Science
    deviceId: '',
    verified: false,
    photoUrl: '/placeholder.svg',
    rollNumber: 'CSE123',
    year: 3,
    section: 'A',
    phoneNumber: '+91 9876543210'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@college.edu',
    role: 'admin',
    verified: true,
    photoUrl: '/placeholder.svg'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Try to login with the real API
      try {
        const response = await api.post<{user: User}>('/api/auth/login', { email, password });
        const userData = response.user;
        
        if (userData) {
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          toast.success(`Welcome back, ${userData.name}!`);
          return true;
        }
      } catch (apiError) {
        console.log("API login failed, falling back to mock data:", apiError);
        
        // Fallback to mock data if API fails (for development purposes)
        const foundUser = mockUsers.find(u => u.email === email);
        
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('user', JSON.stringify(foundUser));
          toast.success(`Welcome back, ${foundUser.name}!`);
          return true;
        }
      }
      
      // If we get here, neither API nor mock login worked
      toast.error('Invalid credentials');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Try to logout with the real API
    try {
      api.post('/api/auth/logout').catch(err => console.log('Logout API error:', err));
    } catch (error) {
      console.log('Logout API error:', error);
    }
    
    // Always clear local state
    setUser(null);
    localStorage.removeItem('user');
    toast.info('You have been logged out');
  };

  const verifyDevice = async (): Promise<boolean> => {
    if (!user || user.role !== 'student') return false;
    
    try {
      setIsLoading(true);
      
      // Try real API first
      try {
        const response = await api.post<{success: boolean, deviceId: string}>('/api/auth/verify-device');
        
        if (response.success) {
          const updatedUser = { ...user, deviceId: response.deviceId, verified: true };
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          toast.success('Device verified successfully');
          return true;
        }
      } catch (apiError) {
        console.log("API device verification failed, using mock:", apiError);
        
        // Fallback to mock behavior
        const newDeviceId = Math.random().toString(36).substring(2, 15);
        const updatedUser = { ...user, deviceId: newDeviceId, verified: true };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Device verified successfully');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Device verification error:', error);
      toast.error('Device verification failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        verifyDevice,
        isAuthenticated: !!user,
        isFaculty: user?.role === 'faculty',
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
