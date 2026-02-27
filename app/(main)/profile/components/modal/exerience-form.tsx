import React from "react";
import { FormCheckbox } from "@/components/form/form-checkbox";
import { FormInput } from "@/components/form/form-input";
import { FormSubmitButton } from "@/components/form/form-submit-button";
import { FormTextarea } from "@/components/form/form-textarea";
import { Form } from "@/components/ui/form";

import {
  storeExperienceSchema,
  TStoreExperienceSchema,
  TUpdateExperienceSchema,
  updateExperienceSchema,
} from "@/schema/experience";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { Experience } from "@/types";
import { useExperienceFormModal } from "@/hooks/use-base-modal-store";
import { toast } from "sonner";

type ExperienceFormProps = {
  userId?: string;
  defaiultValues?: Experience ;
};

const ExperienceForm = ({ userId, defaiultValues }: ExperienceFormProps) => {
  const experienceFormModal = useExperienceFormModal();
  const experienceId = defaiultValues?.id;
  const isEditMode = !!experienceId;

  const editExperience = useMutateProcessor<TUpdateExperienceSchema | FormData, unknown>({
    url: `/experiences/update/${defaiultValues?.id}`,
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
      title: defaiultValues?.title || undefined,
      company: defaiultValues?.company || undefined,
      description: defaiultValues?.description || undefined,
      start_year: defaiultValues?.start_year || undefined,
      end_year: defaiultValues?.end_year || undefined,
      is_current: defaiultValues?.is_current || false,
      userId: userId || undefined,
    },
    resolver: zodResolver(isEditMode ? updateExperienceSchema : storeExperienceSchema),
    disabled: isSubmitting,
  });

  const isDisabled = form.formState.disabled;

  const onSubmit = (data: TUpdateExperienceSchema | TStoreExperienceSchema) => {
    if (experienceId) {
      editExperience.mutate(
        { ...data, uuid: experienceId },
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
  );
};

export default ExperienceForm;
