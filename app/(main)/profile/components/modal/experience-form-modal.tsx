import { BaseModal } from "@/components/base-modal";
import { useExperienceFormModal } from "@/hooks/use-base-modal-store";
import { useAuth } from "@/hooks/useAuth";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { Experience } from "@/types";
import { Loader2 } from "lucide-react";
import ExperienceForm from "./exerience-form";
import React from "react";

const ExperienceFormModal = () => {
  const { user } = useAuth();
  const experienceFormModal = useExperienceFormModal();

  const experienceUuid = experienceFormModal.uuid;  

  const { data: experienceData, isLoading: isLoadingExperience } = useQueryProcessor<{ data: Experience }>({
    url: `/experiences/show/${experienceUuid}`,
    key: ["experiences", experienceUuid],
    options: {
      enabled: !!experienceUuid,
    },
  });

  const isEditMode = !!experienceUuid;
  const isLoading = isEditMode ? isLoadingExperience : false;

  return (
    <BaseModal
      open={experienceFormModal.isOpen}
      onOpenChange={experienceFormModal.onOpenChange}
      title={isEditMode ? "Edit Experience" : "Add Experience"}
      description={isEditMode ? "Edit your experience details" : "Add a new experience to your profile"}
      size="lg"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ExperienceForm userId={user?.id} defaiultValues={experienceData?.data} />
      )}
    </BaseModal>
  );
};

export default ExperienceFormModal;
