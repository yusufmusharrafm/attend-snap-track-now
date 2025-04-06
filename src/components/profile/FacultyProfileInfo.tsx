
import React from "react";
import { User } from "@/contexts/AuthContext";
import { 
  School, 
  BookOpen,
  Mail,
  Phone,
  Key
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FacultyProfileInfoProps {
  user: User | null;
  facultyInfo: {
    facultyId: string;
    department: string;
    assignedSubjects: string[];
    email: string;
    phone: string;
  };
}

const FacultyProfileInfo = ({ user, facultyInfo }: FacultyProfileInfoProps) => {
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
};

export default FacultyProfileInfo;
