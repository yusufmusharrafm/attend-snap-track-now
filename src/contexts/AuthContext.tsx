
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

export type UserRole = 'student' | 'faculty';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  deviceId?: string;
  verified: boolean;
  photoUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  verifyDevice: () => Promise<boolean>;
  isAuthenticated: boolean;
  isFaculty: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Faculty User',
    email: 'faculty@college.edu',
    role: 'faculty',
    verified: true,
    photoUrl: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'John Student',
    email: 'student@college.edu',
    role: 'student',
    department: 'Computer Science',
    deviceId: '',
    verified: false,
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email (in real app, this would be a backend call)
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (foundUser) {
        // In real implementation, validate password here
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        toast.success(`Welcome back, ${foundUser.name}!`);
        return true;
      } else {
        toast.error('Invalid credentials');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('You have been logged out');
  };

  const verifyDevice = async (): Promise<boolean> => {
    if (!user || user.role !== 'student') return false;
    
    try {
      setIsLoading(true);
      // Generate a random device ID for demo
      const newDeviceId = Math.random().toString(36).substring(2, 15);
      
      // In real app, this would get the actual device fingerprint
      const updatedUser = { ...user, deviceId: newDeviceId, verified: true };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast.success('Device verified successfully');
      return true;
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
        isFaculty: user?.role === 'faculty'
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
