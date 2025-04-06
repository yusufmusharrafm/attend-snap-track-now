
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentActivityTab from "./RecentActivityTab";
import AccountSettingsTab from "./AccountSettingsTab";
import AttendanceRecordsTab from "./AttendanceRecordsTab";
import { User } from "@/contexts/AuthContext";

interface ProfileTabsProps {
  user: User | null;
}

const ProfileTabs = ({ user }: ProfileTabsProps) => {
  return (
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
          <RecentActivityTab />
        </TabsContent>
        
        <TabsContent value="settings">
          <AccountSettingsTab user={user} />
        </TabsContent>
        
        {user?.role === 'student' && (
          <TabsContent value="attendance">
            <AttendanceRecordsTab />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
