import React, { useEffect, useState } from "react";
import { FormInput } from "@/components/form/form-input";
import { FormSubmitButton } from "@/components/form/form-submit-button";
import { FormTextarea } from "@/components/form/form-textarea";
import { Form } from "@/components/ui/form";

import { NewsCategory, storeNewsSchema, TStoreNewsSchema, TUpdateNewsSchema, updateNewsSchema } from "@/schema/news";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { News } from "@/types";
import { useNewsFormModal } from "@/hooks/use-base-modal-store";
import { toast } from "sonner";
import { FormSearch } from "@/components/form/form-search-input";
import { CreateFormData } from "@/lib/utils";
import { FormFileInput } from "@/components/form/form-file-input";
import { FormRichText } from "@/components/form/form-rich-text-editor";
import htmlParser from "html-react-parser";

type NewsFormProps = {
  userId?: string;
  defaiultValues?: News;
};

const NewsForm = ({ userId, defaiultValues }: NewsFormProps) => {
  const newsId = defaiultValues?.id;
  const isEditMode = !!newsId;
  const newsFormModal = useNewsFormModal();
  const [previews, setPreviews] = useState<string[]>([]);

  const editNews = useMutateProcessor<TUpdateNewsSchema | FormData, unknown>({
    url: `/news/update/${defaiultValues?.id}`,
    key: ["news"],
    method: "PATCH",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const createNews = useMutateProcessor<TUpdateNewsSchema | FormData, unknown>({
    url: "/news/store",
    key: ["news"],
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const isSubmitting = editNews.isPending || createNews.isPending;

  const form = useForm({
    defaultValues: {
      title: defaiultValues?.title || undefined,
      source: defaiultValues?.source || undefined,
      content: defaiultValues?.content || undefined,
      category: (defaiultValues?.category as NewsCategory) || undefined,
      posted_by_id: !isEditMode ? userId : undefined,
    },
    resolver: zodResolver(isEditMode ? updateNewsSchema : storeNewsSchema),
    disabled: isSubmitting,
    mode: "onSubmit",
  });

  const isDisabled = form.formState.disabled;

  const onSubmit = (data: any) => {
    const payload: any = {
      title: data.title,
      source: data.source,
      content: data.content,
      category: data.category,
      posted_by_id: data.posted_by_id,
      documents: data.documents,
    };
    console.log("🚀 ~ onSubmit ~ payload:", payload);

    const formData = CreateFormData<any>(payload);

    if (newsId) {
      // editNews.mutate(formData, {
      //   onSuccess: () => {
      //     form.reset();
      //     toast.success("News edited successfully");
      //     newsFormModal.onOpenChange(false);
      //   },
      // });
    } else {
      createNews.mutate(formData, {
        onSuccess: () => {
          form.reset();
          toast.success("News created successfully");
          newsFormModal.onOpenChange(false);
        },
      });
    }
  };

  const categoryOptions = Object.values(NewsCategory).map((value) => ({
    value,
    label: value
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
  }));

  const watchedDocuments = form.watch("documents");

  useEffect(() => {
    if (!watchedDocuments || watchedDocuments.length === 0) {
      setPreviews([]);
      return;
    }
    const newPreviews: string[] = [];
    Array.from(watchedDocuments).forEach((file: any) => {
      if (file instanceof File) {
        const url = URL.createObjectURL(file);
        newPreviews.push(url);
      }
    });
    setPreviews(newPreviews);
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [watchedDocuments]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off" className="flex flex-col">
        <section className="flex flex-col gap-5 pb-4">
          <FormInput control={form.control} name="title" label="Title" placeholder="Enter title name" />
          <FormInput control={form.control} name="source" label="Source" placeholder="Enter source name" />

          <FormSearch control={form.control} name="category" label="Post Categoty" options={categoryOptions} />
          <FormFileInput
            control={form.control}
            name="documents"
            label="Upload Documents"
            multiple={true}
            accept="image/*,application/pdf"
          />
          {previews.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {previews.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`preview-${index}`}
                  className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                />
              ))}
            </div>
          )}

          <FormRichText
            control={form.control}
            name="content"
            label="Content"
            placeholder="Write your content here..."
          />
        </section>

        <FormSubmitButton
          label="Submit"
          submittingLabel="Submitting"
          disabled={isDisabled}
          isSubmitting={isSubmitting}
          onClear={isEditMode ? undefined : () => form.reset()}
        />
      </form>
    </Form>
  );
};

export default NewsForm;
