"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { CreateFormData, formatText } from "@/lib/utils";
import { User } from "@/types";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useState, useRef } from "react";
import { toast } from "sonner";

export type ProfileHeaderProps = {
  data: User;
};

export default function ProfileHeader({ data }: ProfileHeaderProps) {
  // const auth = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProfilePhoto = useMutateProcessor<any | FormData, unknown>({
    url: `/users/photo/update/${data.id}`,
    key: ["users", data.id],
    method: "PATCH",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const onSubmit = () => {
    if (files.length === 0) {
      toast.error("Please select an image first");
      return;
    }

    const payload: { documents: File[] } = { documents: files };
    const formData = CreateFormData<any>(payload);

    updateProfilePhoto.mutate(formData, {
      onSuccess() {
        toast.success("Profile photo has been updated");
        setFiles([]);
        setPreviews([]);
      },
    });
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return parts.length === 1 ? parts[0][0].toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(`${data.first_name} ${data.last_name}`);

  const getColorFromName = (name?: string) => {
    const colors = ["#F87171", "#FBBF24", "#34D399", "#60A5FA", "#A78BFA", "#F472B6", "#F97316"];
    if (!name) return colors[0];
    const charCodeSum = name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charCodeSum % colors.length];
  };

  const bgColor = getColorFromName(`${data.first_name} ${data.last_name}`);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    setFiles([file]);
    setPreviews([URL.createObjectURL(file)]);
  };

  return (
    <Card className="overflow-hidden relative">
      <div className="h-32 bg-gradient-to-r from-primary to-primary/60" />
      <CardContent className="relative -mt-16 pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 shadow-md border-card text-2xl font-bold flex items-center justify-center">
                <AvatarImage src={data.photo_url} className="h-full w-full object-cover" />
                <AvatarFallback style={{ backgroundColor: bgColor }}>
                  {previews[0] ? (
                    <img src={previews[0]} alt="profile" className="h-full w-full object-cover" />
                  ) : (
                    initials
                  )}
                </AvatarFallback>
              </Avatar>

              <Button
                size="sm"
                variant="outline"
                className="absolute top-0 right-0 -translate-x-1/4 -translate-y-1/4 rounded-full w-8 h-8 flex items-center justify-center p-0 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                ✎
              </Button>

              <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
            </div>
            <div className="pb-2">
              <h2 className="text-2xl font-bold text-foreground">
                {formatText(`${data.first_name} ${data.last_name}`, "capitalized")}
              </h2>
              <p className="text-muted-foreground">{formatText(data.role?.name || "", "capitalized")}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {files.length > 0 && (
              <>
                <Button variant="default" onClick={onSubmit} className="cursor-pointer">
                  {updateProfilePhoto.isPending ? "Submitting..." : "Save Photo"}
                </Button>
                {!updateProfilePhoto.isPending && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setFiles([]);
                      setPreviews([]);
                    }}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
