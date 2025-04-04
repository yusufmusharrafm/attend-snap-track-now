
import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, RefreshCw } from 'lucide-react';

interface QRCodeGeneratorProps {
  subjectId: string;
  period: number;
  validitySeconds?: number;
}

const QRCodeGenerator = ({ 
  subjectId, 
  period, 
  validitySeconds = 30 
}: QRCodeGeneratorProps) => {
  const [qrValue, setQrValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(validitySeconds);
  const [isExpired, setIsExpired] = useState(false);

  // Generate QR code data with timestamp to ensure uniqueness
  const generateQRData = () => {
    const timestamp = new Date().getTime();
    const data = {
      subjectId,
      period,
      timestamp,
      expiry: timestamp + (validitySeconds * 1000)
    };
    return JSON.stringify(data);
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
        <CardDescription>
          Scan within {timeLeft} seconds
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
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
