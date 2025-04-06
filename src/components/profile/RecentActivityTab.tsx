
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const RecentActivityTab = () => {
  return (
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
  );
};

export default RecentActivityTab;
