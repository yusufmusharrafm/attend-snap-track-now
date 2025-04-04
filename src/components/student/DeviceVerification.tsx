
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const DeviceVerification = () => {
  const { user, verifyDevice } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);
  
  useEffect(() => {
    // Check if device needs verification
    if (user && user.role === 'student' && !user.verified) {
      toast.warning('Your device needs to be verified for attendance tracking');
    }
  }, [user]);
  
  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const success = await verifyDevice();
      if (success) {
        toast.success('Device verified successfully!');
      } else {
        toast.error('Device verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('An error occurred during verification');
    } finally {
      setIsVerifying(false);
    }
  };
  
  if (!user || user.role !== 'student') return null;
  
  // If already verified, show verification status
  if (user.verified) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Device Verified
          </CardTitle>
          <CardDescription>
            Your device is registered for attendance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            This device has been verified for attendance tracking. You can now scan QR codes to mark your attendance.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // If not verified, show verification prompt
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          Verification Required
        </CardTitle>
        <CardDescription>
          Verify this device to track attendance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          You need to verify this device before you can scan QR codes for attendance. 
          This helps prevent proxy attendance and ensures accurate tracking.
        </p>
        <div className="mt-4 flex items-center p-3 bg-amber-50 text-amber-800 rounded-md">
          <Shield className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-xs">
            Once verified, you can only mark attendance from this device. Contact your administrator if you need to change your device.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleVerify} 
          disabled={isVerifying}
          className="w-full"
        >
          {isVerifying ? 'Verifying...' : 'Verify This Device'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeviceVerification;
