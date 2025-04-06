
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@/contexts/AuthContext";
import ProfileAvatar from "./ProfileAvatar";
import StudentProfileInfo from "./StudentProfileInfo";
import FacultyProfileInfo from "./FacultyProfileInfo";
import AdminProfileInfo from "./AdminProfileInfo";

interface ProfileInfoCardProps {
  user: User | null;
  getInitials: (name: string) => string;
  getUserRoleLabel: () => string;
  studentInfo: any;
  facultyInfo: any;
  adminInfo: any;
}

const ProfileInfoCard = ({ 
  user, 
  getInitials, 
  getUserRoleLabel,
  studentInfo,
  facultyInfo,
  adminInfo
}: ProfileInfoCardProps) => {
  const renderRoleSpecificInfo = () => {
    if (user?.role === 'admin') {
      return <AdminProfileInfo user={user} adminInfo={adminInfo} />;
    }
    
    if (user?.role === 'faculty') {
      return <FacultyProfileInfo user={user} facultyInfo={facultyInfo} />;
    }
    
    // Student role is default
    return <StudentProfileInfo user={user} studentInfo={studentInfo} />;
  };

  return (
    <Card className="w-full md:w-1/3">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Your personal information and credentials
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center text-center space-y-4">
        <ProfileAvatar 
          user={user}
          getInitials={getInitials}
          getUserRoleLabel={getUserRoleLabel}
        />
        {renderRoleSpecificInfo()}
      </CardContent>
    </Card>
  );
};

export default ProfileInfoCard;
