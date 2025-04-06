
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import TimetableManager from '@/components/faculty/TimetableManager';
import { Calendar } from 'lucide-react';

const TimetablePage = () => {
  const { isAuthenticated, isFaculty } = useAuth();
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  // Check if user is faculty
  if (!isFaculty) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calendar className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timetable Management</h1>
          <p className="text-muted-foreground">
            Manage class schedules and periods
          </p>
        </div>
      </div>
      
      <TimetableManager />
    </div>
  );
};

export default TimetablePage;
