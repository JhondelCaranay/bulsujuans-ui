import CreateExperienceModal from "@/app/(main)/profile/components/modal/create-experience-modal";
import { useCreateExperienceModal } from "@/hooks/use-base-modal-store";

const ModalProvider = () => {
  const createExperienceModal = useCreateExperienceModal();

  if (createExperienceModal.isOpen) return <CreateExperienceModal />;
};

export default ModalProvider;
