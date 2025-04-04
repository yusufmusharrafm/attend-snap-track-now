
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const AdminQRCodeGenerator = () => {
  const [qrValue, setQrValue] = useState('');
  const [department, setDepartment] = useState('');
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [period, setPeriod] = useState('1');

  const generateQRCode = () => {
    if (!department || !classId || !subjectId || !period) {
      toast.error('Please fill all fields');
      return;
    }

    const data = {
      department,
      classId,
      subjectId,
      period,
      timestamp: new Date().getTime(),
    };
    
    setQrValue(JSON.stringify(data));
    toast.success('QR Code generated successfully');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generate Attendance QR Code</CardTitle>
        <CardDescription>
          Create a QR code that students can scan to mark attendance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={department}
                onValueChange={setDepartment}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cse">Computer Science</SelectItem>
                  <SelectItem value="ece">Electronics</SelectItem>
                  <SelectItem value="mech">Mechanical</SelectItem>
                  <SelectItem value="civil">Civil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select
                value={classId}
                onValueChange={setClassId}
              >
                <SelectTrigger id="class">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">First Year</SelectItem>
                  <SelectItem value="2">Second Year</SelectItem>
                  <SelectItem value="3">Third Year</SelectItem>
                  <SelectItem value="4">Fourth Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Subject Code"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="period">Period</Label>
              <Select
                value={period}
                onValueChange={setPeriod}
              >
                <SelectTrigger id="period">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      Period {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={generateQRCode} className="w-full">Generate QR Code</Button>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            {qrValue ? (
              <div className="p-4 bg-white rounded-lg">
                <QRCodeSVG
                  value={qrValue}
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>
            ) : (
              <div className="p-10 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
                QR Code will appear here
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminQRCodeGenerator;
