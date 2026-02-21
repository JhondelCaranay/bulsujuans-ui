import ExperienceFormModal from "@/app/(main)/profile/components/modal/experience-form-modal";
import { useExperienceFormModal } from "@/hooks/use-base-modal-store";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { Experience } from "@/types";

const ModalProvider = () => {
  const experienceFormModal = useExperienceFormModal();

  const { data: experienceData, isLoading: isLoadingExperience } = useQueryProcessor<{ data: Experience }>({
    url: `/experiences/show/${experienceFormModal.uuid}`,
    key: ["experiences", experienceFormModal.uuid],
    options: {
      enabled: !!experienceFormModal.uuid,
    },
  });

  if (experienceFormModal.isOpen && !isLoadingExperience) return <ExperienceFormModal data={experienceData?.data} />;
};

export default ModalProvider;
