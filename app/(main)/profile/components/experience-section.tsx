"use client";

import React, { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Experience } from "@/types";
import { useExperienceFormModal } from "@/hooks/use-base-modal-store";
import { useAuth } from "@/hooks/useAuth";
import ExperienceItem from "./experience-item";

interface ExperienceSectionProps {
  items: Experience[];
}

export function ExperienceSection({ items }: ExperienceSectionProps) {
  const { hasPermission } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);

  const experienceFormModal = useExperienceFormModal();
  const canEditProfile = hasPermission("profile:edit_profile");

  return (
    <Card>
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between w-full">
          <CardTitle>Experiences</CardTitle>

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
        <CardContent className="space-y-6 border-t pt-6">
          {items.length === 0 && <p className="text-sm text-muted-foreground">No experiences added yet.</p>}

          {items.map((item) => {
            return <ExperienceItem key={item.id} item={item} />;
          })}
        </CardContent>
      )}
    </Card>
  );
}
