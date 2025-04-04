import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Camera, Wifi, WifiOff } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

const QRScanner = () => {
  const { user } = useAuth();
  const { recordAttendance } = useData();
  const [scanning, setScanning] = useState(false);
  const [wifiConnected, setWifiConnected] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if connected to college WiFi
  const checkWifiConnection = () => {
    // In a real app, you'd check if connected to college WiFi
    // For demo, we'll just simulate it with a 70% chance of being connected
    const isConnected = Math.random() > 0.3;
    setWifiConnected(isConnected);
    return isConnected;
  };

  useEffect(() => {
    // Check WiFi on component mount
    checkWifiConnection();
    
    // Interval to simulate WiFi status changes
    const wifiInterval = setInterval(() => {
      checkWifiConnection();
    }, 10000);
    
    return () => {
      clearInterval(wifiInterval);
      if (scannerRef.current) {
        scannerRef.current.stop().catch(err => {
          console.error('Error stopping scanner:', err);
        });
      }
    };
  }, []);

  const startScanner = () => {
    if (!containerRef.current) return;
    
    const html5QrCode = new Html5Qrcode('qr-reader');
    scannerRef.current = html5QrCode;
    
    html5QrCode.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      onScanSuccess,
      onScanFailure
    ).catch(err => {
      console.error('Error starting scanner:', err);
      toast.error('Could not start camera. Please check permissions.');
      setScanning(false);
    });
    
    setScanning(true);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(err => {
        console.error('Error stopping scanner:', err);
      });
    }
    setScanning(false);
  };

  const onScanSuccess = (decodedText: string) => {
    try {
      // Prevent scanning the same QR code multiple times in quick succession
      if (decodedText === lastScanned) return;
      setLastScanned(decodedText);
      
      // Parse QR code data
      const data = JSON.parse(decodedText);
      const { subjectId, expiry } = data;
      
      // Check if QR code has expired
      const currentTime = new Date().getTime();
      if (currentTime > expiry) {
        toast.error('QR code has expired. Please scan a new one.');
        return;
      }
      
      // Check WiFi connection
      const isWifiConnected = checkWifiConnection();
      
      // Validate student can record attendance
      if (user && user.role === 'student' && user.verified) {
        // Record attendance - fixing here by passing only the required 3 arguments
        recordAttendance(user.id, subjectId, isWifiConnected);
        
        // Success message with WiFi status
        if (isWifiConnected) {
          toast.success('Attendance recorded successfully!');
        } else {
          toast.warning('Attendance recorded, but WiFi verification failed. Please connect to college WiFi.');
        }
        
        // Stop scanner after successful scan
        stopScanner();
      } else {
        toast.error('Unable to record attendance. Please verify your device first.');
      }
    } catch (error) {
      console.error('QR code parsing error:', error);
      toast.error('Invalid QR code format');
    }
  };

  const onScanFailure = (error: string) => {
    // Don't show errors for normal scanning process
    // console.error('QR scan error:', error);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Attendance Scanner
          <Badge 
            variant={wifiConnected ? "secondary" : "destructive"}
            className="flex items-center gap-1"
          >
            {wifiConnected ? (
              <>
                <Wifi className="h-3 w-3" />
                <span>Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3" />
                <span>Not Connected</span>
              </>
            )}
          </Badge>
        </CardTitle>
        <CardDescription>
          Scan the QR code to mark your attendance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          ref={containerRef} 
          id="qr-reader" 
          className="w-full h-64 overflow-hidden rounded-md bg-muted"
        />
      </CardContent>
      <CardFooter>
        <Button 
          onClick={scanning ? stopScanner : startScanner} 
          className="w-full"
          variant={scanning ? "destructive" : "default"}
        >
          <Camera className="h-4 w-4 mr-2" />
          {scanning ? 'Stop Scanner' : 'Start Scanner'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QRScanner;
