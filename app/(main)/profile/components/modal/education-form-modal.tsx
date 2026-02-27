import { BaseModal } from "@/components/base-modal";
import { useAuth } from "@/hooks/useAuth";
import { useEducationFormModal } from "@/hooks/use-base-modal-store";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { Education } from "@/types";
import { Loader2 } from "lucide-react";
import EducationForm from "./education-form";
import React from "react";

const EducationFormModal = () => {
  const { user } = useAuth();
  const educationFormModal = useEducationFormModal();
  const educationId = educationFormModal.uuid;

  const { data: educationData, isLoading: isLoadingEducation } = useQueryProcessor<{ data: Education }>({
    url: `/education/show/${educationId}`,
    key: ["educations", educationId],
    options: {
      enabled: !!educationId,
    },
  });

  const isEditMode = !!educationId;
  const isLoading = isEditMode ? isLoadingEducation : false;

  return (
    <BaseModal
      open={educationFormModal.isOpen}
      onOpenChange={educationFormModal.onOpenChange}
      title={isEditMode ? "Edit Education" : "Add Education"}
      description={isEditMode ? "Edit your education details" : "Add a new education to your profile"}
      size="lg"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <EducationForm userId={user?.id} defaiultValues={educationData?.data} />
      )}
    </BaseModal>
  );
};

export default EducationFormModal;
