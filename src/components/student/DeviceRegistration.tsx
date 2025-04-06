
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Smartphone, Check, AlertTriangle, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const DeviceRegistration = () => {
  const { user, verifyDevice } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [locationChecked, setLocationChecked] = useState(false);
  
  const handleRegisterDevice = async () => {
    setIsRegistering(true);
    
    // Check browser location first
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            // In a real app, you'd verify this is within campus boundaries
            setLocationChecked(true);
            
            // Now register the device
            const success = await verifyDevice();
            if (success) {
              toast.success('Device registered successfully!');
            } else {
              toast.error('Device registration failed. Please try again.');
            }
            setIsRegistering(false);
          },
          (error) => {
            console.error('Geolocation error:', error);
            toast.error('Location access denied. Please enable location services to register your device.');
            setIsRegistering(false);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        toast.error('Geolocation is not supported by your browser.');
        setIsRegistering(false);
      }
    } catch (error) {
      console.error('Error registering device:', error);
      toast.error('An error occurred during device registration');
      setIsRegistering(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Device Registration
        </CardTitle>
        <CardDescription>
          Register your device for attendance marking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Device Status</p>
              <p className="text-xs text-muted-foreground">
                Your device must be registered to mark attendance
              </p>
            </div>
          </div>
          <Badge variant={user?.verified ? "success" : "destructive"}>
            {user?.verified ? "Verified" : "Unverified"}
          </Badge>
        </div>
        
        {!user?.verified && (
          <div className="rounded-md border p-4 mt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Important Information</h4>
                <ul className="mt-2 text-sm text-muted-foreground space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    You can only register one device
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Registration requires your physical presence on campus
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    You must be connected to the college WiFi
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Any change of device requires administrator approval
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {user?.verified && (
          <div className="rounded-md border border-green-200 bg-green-50 p-4 mt-4">
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Device Successfully Registered</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your device is registered and ready for attendance marking. If you need to change your device, please contact the administrator.
                </p>
                <div className="mt-2 text-xs">
                  <span className="font-medium">Device ID: </span>
                  <span className="text-muted-foreground">{user.deviceId?.substring(0, 12)}...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      {!user?.verified && (
        <CardFooter>
          <Button
            onClick={handleRegisterDevice}
            disabled={isRegistering}
            className="w-full"
          >
            {isRegistering ? (
              <>Verifying Location...</>
            ) : (
              <>
                <MapPin className="h-4 w-4 mr-2" />
                Register This Device
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default DeviceRegistration;
