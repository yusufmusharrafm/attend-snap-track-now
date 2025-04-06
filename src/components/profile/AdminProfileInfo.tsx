
import React from "react";
import { User } from "@/contexts/AuthContext";
import { 
  Key,
  Layers,
  Mail
} from "lucide-react";

interface AdminProfileInfoProps {
  user: User | null;
  adminInfo: {
    adminId: string;
    role: string;
    accessLevel: string;
    email: string;
  };
}

const AdminProfileInfo = ({ user, adminInfo }: AdminProfileInfoProps) => {
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
};

export default AdminProfileInfo;
