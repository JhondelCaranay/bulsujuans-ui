import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Briefcase, User as UserIcon, Pencil } from "lucide-react";
import { User } from "@/types";
import { formatText } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ProfileInfoProps = {
  data: User;
};

export default function ProfileInfo({ data }: ProfileInfoProps) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>About</CardTitle>

        {/* <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button> */}
      </CardHeader>

      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-4 ">
          <InfoItem icon={<Mail className="h-5 w-5 text-primary" />} label="Email" value={data?.email} />

          <InfoItem
            icon={<UserIcon className="h-5 w-5 text-primary" />}
            label="Name"
            value={formatText(`${data?.first_name} ${data?.middle_name ?? ""} ${data?.last_name}`, "capitalized")}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <InfoItem
            icon={<Briefcase className="h-5 w-5 text-primary" />}
            label="System Role"
            value={formatText(data?.role?.name || "", "capitalized")}
          />
          {data?.student_id && (
            <InfoItem
              icon={<Briefcase className="h-5 w-5 text-primary" />}
              label="Student ID"
              value={data?.student_id}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

type InfoItemProps = {
  icon: React.ReactNode;
  label: string;
  value?: string;
};

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value || "-"}</p>
      </div>
    </div>
  );
}
