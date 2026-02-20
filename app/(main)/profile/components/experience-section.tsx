"use client";

import React, { useState } from "react";
import { ChevronDown, Edit, Trash2, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Experience } from "@/types";
import { useCreateExperienceModal } from "@/hooks/use-base-modal-store";

interface ExperienceSectionProps {
  userId: string;
  items: Experience[];
  onAdd?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ExperienceSection({ userId, items, onAdd, onEdit, onDelete }: ExperienceSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const createExperienceModal = useCreateExperienceModal();

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
                createExperienceModal.onOpenChange(true, userId);
              }}
              variant="default"
              size="icon"
              className="cursor-pointer"
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
            const period = item.is_current
              ? `${item.start_year} - Present`
              : item.end_year
                ? `${item.start_year} - ${item.end_year}`
                : `${item.start_year}`;

            return (
              <div key={item.id} className="space-y-2 border-b pb-4 last:border-none">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold text-base">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.company}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">{period}</span>

                    <Button onClick={() => onEdit?.(item.id)} variant="ghost" size="icon" title="Edit">
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete"
                      onClick={() => onDelete?.(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {item.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                )}
              </div>
            );
          })}
        </CardContent>
      )}
    </Card>
  );
}
