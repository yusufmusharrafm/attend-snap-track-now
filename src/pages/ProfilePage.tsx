
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/contexts/DataContext";
import { 
  School, 
  CalendarDays, 
  Layers, 
  BookOpen,
  Smartphone,
  Mail,
  Phone,
  Activity,
  Key
} from "lucide-react";

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { getDepartmentName } = useData();
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getUserRoleLabel = () => {
    if (user?.role === 'admin') return 'Administrator';
    if (user?.role === 'faculty') return 'Faculty Member';
    return 'Student';
  };

  // Mock student data (would come from a real API/database)
  const studentInfo = {
    rollNumber: user?.id || "N/A",
    year: "3rd Year",
    section: "A",
    deviceId: user?.deviceId || (user?.verified ? "Verified Device" : "Unverified"),
    email: user?.email || "student@example.com",
    phone: "+91 9876543210",
    attendancePercentage: "85%",
  };

  // Mock faculty data (would come from a real API/database)
  const facultyInfo = {
    facultyId: user?.id || "N/A",
    department: user?.department || getDepartmentName(user?.departmentId || ""),
    assignedSubjects: ["Data Structures", "Algorithms", "Database Systems"],
    email: user?.email || "faculty@example.com",
    phone: "+91 9876543210",
  };

  // Mock admin data
  const adminInfo = {
    adminId: user?.id || "N/A",
    role: "System Administrator",
    accessLevel: "Full Access",
    email: user?.email || "admin@example.com",
  };

  const renderRoleSpecificInfo = () => {
    if (user?.role === 'admin') {
      return (
        <div className="w-full pt-4 border-t border-border">
          <div className="grid grid-cols-1 gap-4 text-left">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Admin ID</p>
                <p className="text-sm text-muted-foreground">{adminInfo.adminId}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Role</p>
                <p className="text-sm text-muted-foreground">{adminInfo.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{adminInfo.email}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (user?.role === 'faculty') {
      return (
        <div className="w-full pt-4 border-t border-border">
          <div className="grid grid-cols-1 gap-4 text-left">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Faculty ID</p>
                <p className="text-sm text-muted-foreground">{facultyInfo.facultyId}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <School className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Department</p>
                <p className="text-sm text-muted-foreground">{facultyInfo.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Assigned Subjects</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {facultyInfo.assignedSubjects.map((subject, index) => (
                    <Badge key={index} variant="outline">{subject}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{facultyInfo.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{facultyInfo.phone}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Student role is default
    return (
      <div className="w-full pt-4 border-t border-border">
        <div className="grid grid-cols-1 gap-4 text-left">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Roll Number</p>
              <p className="text-sm text-muted-foreground">{studentInfo.rollNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <School className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Department</p>
              <p className="text-sm text-muted-foreground">{user?.department || getDepartmentName(user?.departmentId || "")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Year & Section</p>
              <p className="text-sm text-muted-foreground">{studentInfo.year}, Section {studentInfo.section}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Device ID</p>
              <p className="text-sm text-muted-foreground">{studentInfo.deviceId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{studentInfo.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">{studentInfo.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Attendance</p>
              <p className="text-sm text-muted-foreground">{studentInfo.attendancePercentage}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          View and manage your profile information.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Your personal information and credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl">
                {user?.name ? getInitials(user.name) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{user?.name}</h3>
              <p className="text-sm text-muted-foreground">{getUserRoleLabel()}</p>
            </div>
            {renderRoleSpecificInfo()}
          </CardContent>
        </Card>
        
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="recent">
            <TabsList className="mb-4">
              <TabsTrigger value="recent">Recent Activity</TabsTrigger>
              <TabsTrigger value="settings">Account Settings</TabsTrigger>
              {user?.role === 'student' && (
                <TabsTrigger value="attendance">Attendance Records</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="recent">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent logins and activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b pb-2">
                      <p className="text-sm">Logged in</p>
                      <p className="text-sm text-muted-foreground">Today at {new Date().toLocaleTimeString()}</p>
                    </div>
                    <div className="border-b pb-2">
                      <p className="text-sm">Attendance marked</p>
                      <p className="text-sm text-muted-foreground">Today at 10:15 AM</p>
                    </div>
                    <div className="border-b pb-2">
                      <p className="text-sm">Device verified</p>
                      <p className="text-sm text-muted-foreground">Yesterday at 9:30 AM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h3 className="font-medium mb-2">Device Management</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {user?.verified 
                          ? "Your device is verified and registered with the system." 
                          : "Your device is not verified. Please verify your device to use attendance features."}
                      </p>
                      <Badge variant={user?.verified ? "success" : "destructive"}>
                        {user?.verified ? "Verified" : "Not Verified"}
                      </Badge>
                    </div>
                    
                    <div className="border-b pb-4">
                      <h3 className="font-medium mb-2">Password</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Last changed: 30 days ago
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Notification Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Configure how you receive notifications
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {user?.role === 'student' && (
              <TabsContent value="attendance">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Summary</CardTitle>
                    <CardDescription>Your attendance across all subjects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Data Structures</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Attendance:</span>
                              <Badge variant="outline" className="bg-green-100">90%</Badge>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Database Systems</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Attendance:</span>
                              <Badge variant="outline" className="bg-yellow-100">75%</Badge>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Computer Networks</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Attendance:</span>
                              <Badge variant="outline" className="bg-green-100">85%</Badge>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Operating Systems</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Attendance:</span>
                              <Badge variant="outline" className="bg-red-100">65%</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
