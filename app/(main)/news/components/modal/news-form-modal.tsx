import { BaseModal } from "@/components/base-modal";
import { useAuth } from "@/hooks/useAuth";
import { useNewsFormModal } from "@/hooks/use-base-modal-store";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { News } from "@/types";
import { Loader2 } from "lucide-react";
import React from "react";
import NewsForm from "./news-form";

export type NewsDetailQuery = {
  data: News;
  success: boolean;
  message: string;
};

const NewsFormModal = () => {
  const { user } = useAuth();
  const newsFormModal = useNewsFormModal();
  const newsId = newsFormModal.uuid;

  const { data: newsData, isLoading: isLoadingNews } = useQueryProcessor<NewsDetailQuery>({
    url: `/news/show/${newsId}`,
    key: ["news", newsId],
    options: {
      enabled: !!newsId,
    },
  });

  const isEditMode = !!newsId;
  const isLoading = isEditMode ? isLoadingNews : false;

  return (
    <BaseModal
      open={newsFormModal.isOpen}
      onOpenChange={newsFormModal.onOpenChange}
      title={isEditMode ? "Edit News" : "Add News"}
      description={isEditMode ? "Edit news details" : "Create new post"}
      size="xl"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <NewsForm userId={user?.id} defaiultValues={newsData?.data} />
      )}
    </BaseModal>
  );
};

export default NewsFormModal;
