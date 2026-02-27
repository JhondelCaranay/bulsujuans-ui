"use client";

import React, { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Education } from "@/types";
import EducationItem from "./education-item";
import { Button } from "@/components/ui/button";
import { useEducationFormModal } from "@/hooks/use-base-modal-store";
import { useAuth } from "@/hooks/useAuth";

interface EducationSectionProps {
  items: Education[];
}

export function EducationSection({ items }: EducationSectionProps) {
  const { hasPermission } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const experienceFormModal = useEducationFormModal();
  const canEditProfile = hasPermission("profile:edit_profile");

  return (
    <Card>
      <CardHeader className="cursor-pointer hover:bg-muted/50" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between w-full">
          <CardTitle>Education</CardTitle>

          <div className="flex items-center space-x-3">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                experienceFormModal.onOpenChange(true);
              }}
              variant="default"
              size="icon"
              className="cursor-pointer disabled:pointer-events-none"
              style={{ display: canEditProfile ? "inline-flex" : "none" }}
              disabled={!canEditProfile}
            >
              <Plus className="h-4 w-4" />
            </Button>

            <ChevronDown className={`h-5 w-5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4 border-t border-border pt-4">
          {items.map((item) => (
            <EducationItem key={item.id} data={item} />
          ))}
        </CardContent>
      )}
    </Card>
  );
}
