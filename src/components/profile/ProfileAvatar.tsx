
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/contexts/AuthContext";

interface ProfileAvatarProps {
  user: User | null;
  getInitials: (name: string) => string;
  getUserRoleLabel: () => string;
}

const ProfileAvatar = ({ user, getInitials, getUserRoleLabel }: ProfileAvatarProps) => {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <Avatar className="h-24 w-24">
        <AvatarFallback className="text-2xl">
          {user?.name ? getInitials(user.name) : 'U'}
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 className="text-xl font-semibold">{user?.name}</h3>
        <p className="text-sm text-muted-foreground">{getUserRoleLabel()}</p>
      </div>
    </div>
  );
};

export default ProfileAvatar;
