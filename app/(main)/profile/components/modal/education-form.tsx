import React from "react";
import { FormCheckbox } from "@/components/form/form-checkbox";
import { FormInput } from "@/components/form/form-input";
import { FormSubmitButton } from "@/components/form/form-submit-button";
import { FormTextarea } from "@/components/form/form-textarea";
import { Form } from "@/components/ui/form";

import {
  storeEducationSchema,
  TStoreEducationSchema,
  TUpdateEducationSchema,
  updateEducationSchema,
} from "@/schema/education";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { Education } from "@/types";
import { useEducationFormModal } from "@/hooks/use-base-modal-store";
import { toast } from "sonner";

type EducationFormProps = {
  userId?: string;
  defaiultValues?: Education;
};

const EducationForm = ({ userId, defaiultValues }: EducationFormProps) => {
  const educationFormModal = useEducationFormModal();
  const educationId = defaiultValues?.id;
  const isEditMode = !!educationId;

  const editEducation = useMutateProcessor<TUpdateEducationSchema | FormData, unknown>({
    url: `/education/update/${defaiultValues?.id}`,
    key: ["educations"],
    method: "PATCH",
  });

  const createEducation = useMutateProcessor<TUpdateEducationSchema | FormData, unknown>({
    url: "/education/store",
    key: ["educations"],
    method: "POST",
  });

  const isSubmitting = editEducation.isPending || createEducation.isPending;

  const form = useForm({
    defaultValues: {
      degree: defaiultValues?.degree || undefined,
      institution: defaiultValues?.institution || undefined,
      description: defaiultValues?.description || undefined,
      year: defaiultValues?.year || undefined,
      userId: userId || undefined,
    },
    resolver: zodResolver(isEditMode ? updateEducationSchema : storeEducationSchema),
    disabled: isSubmitting,
  });

  const isDisabled = form.formState.disabled;

  const onSubmit = (data: TUpdateEducationSchema | TStoreEducationSchema) => {
    if (educationId) {
      editEducation.mutate(data, {
        onSuccess: () => {
          form.reset();
          toast.success("Education edited successfully");
          educationFormModal.onOpenChange(false);
        },
      });
    } else {
      createEducation.mutate(data, {
        onSuccess: () => {
          form.reset();
          toast.success("Education created successfully");
          educationFormModal.onOpenChange(false);
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off" className="flex flex-col">
        <section className="flex flex-col gap-5 pb-4">
          <FormInput
            control={form.control}
            name="institution"
            label="Institution"
            placeholder="Enter institution name"
          />
          <FormInput control={form.control} name="degree" label="Degree" placeholder="Enter degree name" />

          <FormTextarea
            control={form.control}
            name="description"
            label="Description"
            placeholder="Enter a detailed description of your education"
          />

          <div className="flex gap-5 justify-between">
            <div className="flex-1">
              <FormInput control={form.control} name="year" label="Start Year" placeholder="" type="number" />
            </div>
          </div>
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

export default EducationForm;
