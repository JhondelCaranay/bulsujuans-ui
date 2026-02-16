import { User } from "@/types";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatText } from "@/lib/utils";
import { AtSign, Calendar, Calendar1, Hash, UserCog } from "lucide-react";
interface UserDetailViewProps {
  user: User;
}

const UserDetailView = ({ user }: UserDetailViewProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="mb-2 text-3xl">
              {formatText(`${user.first_name} ${user.last_name}`, "capitalized")}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AtSign className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Email</h3>
            </div>
            <p className="leading-relaxed text-muted-foreground">{user.email}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Role</h3>
            </div>
            <p className="leading-relaxed text-muted-foreground">{user.role?.name}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">User ID</h3>
            </div>
            <p className="font-mono text-sm text-muted-foreground">{user.id}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Status</h3>
            {user.deleted_at ? (
              <div className="rounded-lg bg-destructive/10 p-3">
                <p className="text-sm text-destructive">Deleted on {formatDate(user.deleted_at)}</p>
              </div>
            ) : (
              <div className="rounded-lg bg-green-500/10 p-3">
                <p className="text-sm text-green-700">Active user</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-lg bg-secondary/10 p-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Created</span>
            </div>
            <p className="text-sm text-foreground">{formatDate(user.createdAt)}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar1 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
            </div>
            <p className="text-sm text-foreground">{formatDate(user.updatedAt)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDetailView;
