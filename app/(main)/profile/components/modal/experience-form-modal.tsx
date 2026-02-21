import { BaseModal } from "@/components/base-modal";
import { FormCheckbox } from "@/components/form/form-checkbox";
import { FormInput } from "@/components/form/form-input";
import { FormSubmitButton } from "@/components/form/form-submit-button";
import { FormTextarea } from "@/components/form/form-textarea";
import { Form } from "@/components/ui/form";
import { useExperienceFormModal } from "@/hooks/use-base-modal-store";
import { useAuth } from "@/hooks/useAuth";
import { useMutateProcessor, useQueryProcessor } from "@/hooks/useTanstackQuery";
import {
  updateExperienceSchema,
  TUpdateExperienceSchema,
  TStoreExperienceSchema,
  storeExperienceSchema,
} from "@/schema/experience";
import { Experience } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export interface AccessQuery {
  data: Experience;
  success: boolean;
  message: string;
}

const ExperienceFormModal = ({ data }: { data?: Experience }) => {
  const { user } = useAuth();
  const experienceFormModal = useExperienceFormModal();

  const experienceUuid = experienceFormModal.uuid;
  const isEditMode = !!experienceUuid;

  const editExperience = useMutateProcessor<TUpdateExperienceSchema | FormData, unknown>({
    url: `/experiences/update/${experienceUuid}`,
    key: ["experiences"],
    method: "PATCH",
  });

  const createExperience = useMutateProcessor<TUpdateExperienceSchema | FormData, unknown>({
    url: "/experiences/store",
    key: ["experiences"],
    method: "POST",
  });

  const isSubmitting = editExperience.isPending || createExperience.isPending;

  const form = useForm({
    defaultValues: {
      title: data?.title || "",
      company: data?.company || "",
      description: data?.description || "",
      start_year: data?.start_year || undefined,
      end_year: data?.end_year || undefined,
      is_current: data?.is_current || false,
      userId: user?.id || undefined,
    },
    resolver: zodResolver(isEditMode ? updateExperienceSchema : storeExperienceSchema),
    disabled: isSubmitting,
  });

  const isDisabled = form.formState.disabled;

  const onSubmit = (data: TUpdateExperienceSchema | TStoreExperienceSchema) => {
    if (experienceUuid) {
      editExperience.mutate(
        { ...data, uuid: experienceUuid },
        {
          onSuccess: () => {
            form.reset();
            toast.success("Experience edited successfully");
            experienceFormModal.onOpenChange(false);
          },
        },
      );
    } else {
      createExperience.mutate(data as any, {
        onSuccess: () => {
          form.reset();
          toast.success("Experience created successfully");
          experienceFormModal.onOpenChange(false);
        },
      });
    }
  };

  return (
    <BaseModal
      open={experienceFormModal.isOpen}
      onOpenChange={experienceFormModal.onOpenChange}
      title={isEditMode ? "Edit Experience" : "Add Experience"}
      description={isEditMode ? "Edit your experience details" : "Add a new experience to your profile"}
      size="lg"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off" className="flex flex-col">
          <section className="flex flex-col gap-5 pb-4">
            <FormInput control={form.control} name="company" label="Company" placeholder="Enter company name" />
            <FormInput control={form.control} name="title" label="Title" placeholder="Enter title" />

            <FormTextarea
              control={form.control}
              name="description"
              label="Description"
              placeholder="Enter a detailed description of your experience"
            />

            <div className="flex gap-5 justify-between">
              <div className="flex-1">
                <FormInput control={form.control} name="start_year" label="Start Year" placeholder="" type="number" />
              </div>
              <div className="flex-1">
                <FormInput control={form.control} name="end_year" label="End Year" placeholder="" type="number" />
              </div>
            </div>

            <FormCheckbox control={form.control} name="is_current" label="I currently work here" />
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
    </BaseModal>
  );
};

export default ExperienceFormModal;
