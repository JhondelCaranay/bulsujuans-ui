import EducationFormModal from "@/app/(main)/profile/components/modal/education-form-modal";
import ExperienceFormModal from "@/app/(main)/profile/components/modal/experience-form-modal";
import { useEducationFormModal, useExperienceFormModal } from "@/hooks/use-base-modal-store";

const ModalProvider = () => {
  const experienceFormModal = useExperienceFormModal();
  const educationFormModal = useEducationFormModal();

  if (experienceFormModal.isOpen) return <ExperienceFormModal />;
  if (educationFormModal.isOpen) return <EducationFormModal />;
};

export default ModalProvider;
