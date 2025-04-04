
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import DepartmentsTable from '@/components/faculty/DepartmentsTable';

const DepartmentsPage = () => {
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
        <p className="text-muted-foreground">
          Manage all departments in the system
        </p>
      </div>
      
      <DepartmentsTable />
    </div>
  );
};

export default DepartmentsPage;
