
import React from "react";
import { User } from "@/contexts/AuthContext";
import { 
  School, 
  CalendarDays, 
  Layers, 
  BookOpen,
  Smartphone,
  Mail,
  Phone,
  Activity,
  Key,
  User as UserIcon
} from "lucide-react";
import { useData } from "@/contexts/DataContext";

interface StudentProfileInfoProps {
  user: User | null;
  studentInfo: {
    rollNumber: string;
    year: string;
    section: string;
    deviceId: string;
    email: string;
    phone: string;
    attendancePercentage: string;
  };
}

const StudentProfileInfo = ({ user, studentInfo }: StudentProfileInfoProps) => {
  const { getDepartmentName } = useData();
  
  return (
    <div className="w-full pt-4 border-t border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
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
            <p className="text-sm text-muted-foreground">{user?.department || getDepartmentName(user?.department || "")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Year</p>
            <p className="text-sm text-muted-foreground">{studentInfo.year}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UserIcon className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Section</p>
            <p className="text-sm text-muted-foreground">Section {studentInfo.section}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Device Status</p>
            <p className="text-sm text-muted-foreground">
              {user?.verified ? 
                (studentInfo.deviceId !== "Unverified" ? "Verified Device" : "Unverified") : 
                "Unverified"}
            </p>
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

export default StudentProfileInfo;
