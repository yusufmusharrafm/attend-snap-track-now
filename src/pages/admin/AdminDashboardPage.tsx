
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminStats from '@/components/admin/AdminStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdminQRCodeGenerator from '@/components/admin/QRCodeGenerator';

const AdminDashboardPage = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  
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
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}!
        </p>
      </div>
      
      <AdminStats />
      
      <div className="space-y-6">
        <h2 className="text-xl font-semibold tracking-tight">QR Code Generator</h2>
        <AdminQRCodeGenerator />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
