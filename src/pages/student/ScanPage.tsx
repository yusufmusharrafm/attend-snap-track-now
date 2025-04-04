
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import QRScanner from '@/components/QRScanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Wifi, WifiOff, Info } from 'lucide-react';

const ScanPage = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  // Check if user is student
  if (user?.role !== 'student') {
    return <Navigate to="/admin" />;
  }
  
  // Check if device is verified
  const isDeviceVerified = user.verified;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scan QR Code</h1>
        <p className="text-muted-foreground">
          Scan the QR code to mark your attendance
        </p>
      </div>
      
      {!isDeviceVerified && (
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>Action Required</AlertTitle>
          <AlertDescription>
            Your device is not verified. Please verify your device from the dashboard before scanning QR codes.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <QRScanner />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
            <CardDescription>
              How to properly scan attendance QR codes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Requirements</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Camera access must be allowed for the scanner to work</li>
                <li className="flex items-center gap-1">
                  <Wifi className="h-3 w-3 text-green-500" />
                  <span>Connect to the college WiFi network</span>
                </li>
                <li>QR codes are valid for 30 seconds only</li>
                <li>You can only mark attendance from your verified device</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Troubleshooting</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Ensure good lighting conditions</li>
                <li>Hold the device steady while scanning</li>
                <li className="flex items-center gap-1">
                  <WifiOff className="h-3 w-3 text-red-500" />
                  <span>Not connected to college WiFi will be flagged</span>
                </li>
                <li>If scan fails, refresh and try again</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScanPage;
