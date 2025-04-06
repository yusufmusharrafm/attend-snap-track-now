
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInfoCard from "@/components/profile/ProfileInfoCard";
import ProfileTabs from "@/components/profile/ProfileTabs";

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  
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
    department: user?.department || "Computer Science",
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

  return (
    <div className="space-y-6">
      <ProfileHeader 
        title="My Profile"
        description="View and manage your profile information."
      />
      
      <div className="flex flex-col md:flex-row gap-6">
        <ProfileInfoCard 
          user={user}
          getInitials={getInitials}
          getUserRoleLabel={getUserRoleLabel}
          studentInfo={studentInfo}
          facultyInfo={facultyInfo}
          adminInfo={adminInfo}
        />
        
        <ProfileTabs user={user} />
      </div>
    </div>
  );
};

export default ProfilePage;
