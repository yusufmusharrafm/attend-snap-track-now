
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import StudentsTable from '@/components/admin/StudentsTable';

const StudentsPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  // Check if user is admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground">
          Manage all students in the system
        </p>
      </div>
      
      <StudentsTable />
    </div>
  );
};

export default StudentsPage;
