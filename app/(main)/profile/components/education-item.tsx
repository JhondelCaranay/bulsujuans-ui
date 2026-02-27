import { Button } from "@/components/ui/button";
import { useEducationFormModal } from "@/hooks/use-base-modal-store";
import { useConfirm } from "@/hooks/use-confirm";
import { useAuth } from "@/hooks/useAuth";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { Education } from "@/types";
import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type EducationItemProps = {
  data: Education;
};

const EducationItem = ({ data }: EducationItemProps) => {
  const { hasPermission } = useAuth();

  const [DeleteExpConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this record. This action is permanent and cannot be undone.",
  );

  const canEditProfile = hasPermission("profile:edit_profile");

  const educationFormModal = useEducationFormModal();

  const deleteEducation = useMutateProcessor<any, unknown>({
    url: `/education/destroy/${data.id}`,
    key: ["educations"],
    method: "DELETE",
  });

  const handleEdit = (id: string) => {
    educationFormModal.onOpenChange(true, id);
  };

  const handleDelete = async () => {
    const confirmed = await confirm();
    if (confirmed) {
      deleteEducation.mutate(
        {},
        {
          onSuccess: () => {
            toast.success("Education removed successfully");
          },
        },
      );
    }
  };

  return (
    <div className="space-y-1 border-b pb-4 last:border-none">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="font-semibold text-base">{data.institution}</p>
          <p className="text-sm text-muted-foreground">{data.degree}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm text-muted-foreground whitespace-nowrap">{data.year}</span>

          <Button
            onClick={() => handleEdit(data.id)}
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
      <p className="text-sm text-foreground">{data.description}</p>
      <DeleteExpConfirmDialog />
    </div>
  );
};

export default EducationItem;
