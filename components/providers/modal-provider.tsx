import NewsFormModal from "@/app/(main)/news/components/modal/news-form-modal";
import EducationFormModal from "@/app/(main)/profile/components/modal/education-form-modal";
import ExperienceFormModal from "@/app/(main)/profile/components/modal/experience-form-modal";
import { useEducationFormModal, useExperienceFormModal, useNewsFormModal } from "@/hooks/use-base-modal-store";

const ModalProvider = () => {
  const experienceFormModal = useExperienceFormModal();
  const educationFormModal = useEducationFormModal();
  const newsFormModal = useNewsFormModal();

  if (experienceFormModal.isOpen) return <ExperienceFormModal />;
  if (educationFormModal.isOpen) return <EducationFormModal />;
  if (newsFormModal.isOpen) return <NewsFormModal />;
};

export default ModalProvider;
