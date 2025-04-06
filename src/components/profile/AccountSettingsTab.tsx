
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "@/contexts/AuthContext";

interface AccountSettingsTabProps {
  user: User | null;
}

const AccountSettingsTab = ({ user }: AccountSettingsTabProps) => {
  return (
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
  );
};

export default AccountSettingsTab;
