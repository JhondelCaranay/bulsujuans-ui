import { Button } from "@/components/ui/button";
import { useExperienceFormModal } from "@/hooks/use-base-modal-store";
import { useConfirm } from "@/hooks/use-confirm";
import { useAuth } from "@/hooks/useAuth";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { Experience } from "@/types";
import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type ExperienceItemProps = {
  item: Experience;
};

const ExperienceItem = ({ item }: ExperienceItemProps) => {
  const { hasPermission } = useAuth();

  const [DeleteExpConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this record. This action is permanent and cannot be undone.",
  );

  const deleteExperience = useMutateProcessor<any, unknown>({
    url: `/experiences/destroy/${item.id}`,
    key: ["experiences"],
    method: "DELETE",
  });

  const canEditProfile = hasPermission("profile:edit_profile");

  const experienceFormModal = useExperienceFormModal();

  const period = item.is_current
    ? `${item.start_year} - Present`
    : item.end_year
      ? `${item.start_year} - ${item.end_year}`
      : `${item.start_year}`;

  const handleEdit = (id: string) => {
    experienceFormModal.onOpenChange(true, id);
  };

  const handleDelete = async () => {
    const confirmed = await confirm();

    if (confirmed) {
      deleteExperience.mutate(
        {},
        {
          onSuccess: () => {
            toast.success("Experience removed successfully");
          },
        },
      );
    }
  };

  return (
    <div key={item.id} className="space-y-2 border-b pb-4 last:border-none">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="font-semibold text-base">{item.title}</p>
          <p className="text-sm text-muted-foreground">{item.company}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm text-muted-foreground whitespace-nowrap">{period}</span>

          <Button
            onClick={() => handleEdit(item.id)}
            variant="ghost"
            size="icon"
            title="Edit"
            disabled={!canEditProfile}
            style={{ display: canEditProfile ? "inline-flex" : "none" }}
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            title="Delete"
            onClick={() => handleDelete()}
            className="text-destructive hover:text-destructive"
            disabled={!canEditProfile}
            style={{ display: canEditProfile ? "inline-flex" : "none" }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {item.description && <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>}
      <DeleteExpConfirmDialog />
    </div>
  );
};

export default ExperienceItem;
