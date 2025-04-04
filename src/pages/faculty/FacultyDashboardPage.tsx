
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import FacultyStats from '@/components/faculty/FacultyStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FacultyQRCodeGenerator from '@/components/faculty/FacultyQRCodeGenerator';
import StudentPhotoGallery from '@/components/faculty/StudentPhotoGallery';

const FacultyDashboardPage = () => {
  const { user, isAuthenticated, isFaculty } = useAuth();
  
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
        <h1 className="text-3xl font-bold tracking-tight">Faculty Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}!
        </p>
      </div>
      
      <FacultyStats />
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight">QR Code Generator</h2>
          <FacultyQRCodeGenerator />
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight">Class Students</h2>
          <StudentPhotoGallery />
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboardPage;
