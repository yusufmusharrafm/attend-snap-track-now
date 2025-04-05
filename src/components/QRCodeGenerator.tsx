
import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, RefreshCw, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import crypto from 'crypto-js';

interface QRCodeGeneratorProps {
  subjectId: string;
  period: number;
  validitySeconds?: number;
}

const QRCodeGenerator = ({ 
  subjectId, 
  period, 
  validitySeconds = 45 // Changed default to 45 seconds as requested
}: QRCodeGeneratorProps) => {
  const [qrValue, setQrValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(validitySeconds);
  const [isExpired, setIsExpired] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const { user } = useAuth();

  // Generate a secure session ID for the attendance session
  const generateSessionId = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  // Generate a secure HMAC token for validation
  const generateSecureToken = (data: any) => {
    // In a real implementation, this would use a server-side secret
    // For demo purposes we're using a combination of subject, faculty ID and timestamp
    const secretKey = `${subjectId}-${user?.id}-${new Date().toISOString().split('T')[0]}`;
    const hmac = crypto.HmacSHA256(JSON.stringify(data), secretKey);
    return hmac.toString(crypto.enc.Base64);
  };

  // Generate QR code data with timestamp and security token
  const generateQRData = () => {
    const timestamp = new Date().getTime();
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    
    const data = {
      subjectId,
      period,
      sessionId: newSessionId,
      facultyId: user?.id,
      timestamp,
      expiry: timestamp + (validitySeconds * 1000)
    };
    
    // Add security token to verify data hasn't been tampered with
    const token = generateSecureToken(data);
    const secureData = {
      ...data,
      token
    };
    
    return JSON.stringify(secureData);
  };

  // Generate new QR code
  const generateNewQRCode = () => {
    setQrValue(generateQRData());
    setTimeLeft(validitySeconds);
    setIsExpired(false);
  };

  // Initialize QR code on first render
  useEffect(() => {
    generateNewQRCode();
  }, [subjectId, period]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Calculate time left percentage for progress indicator
  const timeLeftPercentage = (timeLeft / validitySeconds) * 100;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          QR Code for Period {period}
          {isExpired ? (
            <Badge variant="destructive">Expired</Badge>
          ) : (
            <Badge variant="secondary" className="animate-pulse-light">Active</Badge>
          )}
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>Scan within {timeLeft} seconds</span>
          <div className="flex items-center text-xs text-muted-foreground">
            <Shield className="h-3 w-3 mr-1" />
            <span>Session: {sessionId.substring(0, 6)}...</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className={`p-4 bg-white rounded-lg ${isExpired ? 'opacity-50' : ''}`}>
          <QRCodeSVG
            value={qrValue}
            size={200}
            level="H"
            includeMargin
            imageSettings={{
              src: "/placeholder.svg",
              excavate: true,
              height: 24,
              width: 24,
            }}
          />
        </div>
        
        {/* Time progress bar */}
        <div className="w-full mt-4 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-1000" 
            style={{ width: `${timeLeftPercentage}%` }} 
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-1 text-sm">
          <Clock className="h-4 w-4" />
          <span>{timeLeft}s remaining</span>
        </div>
        <Button 
          onClick={generateNewQRCode} 
          variant="outline"
          disabled={!isExpired && timeLeft > 0}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Regenerate
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QRCodeGenerator;
