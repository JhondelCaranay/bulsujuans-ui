import { BaseModal } from "@/components/base-modal";
import { FormCheckbox } from "@/components/form/form-checkbox";
import { FormInput } from "@/components/form/form-input";
import { FormSubmitButton } from "@/components/form/form-submit-button";
import { FormTextarea } from "@/components/form/form-textarea";
import { Form } from "@/components/ui/form";
import { useCreateExperienceModal } from "@/hooks/use-base-modal-store";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { storeExperienceSchema, TStoreExperienceSchema } from "@/schema/experience";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateExperienceModal = () => {
  const useExperienceModal = useCreateExperienceModal();

  const createExperience = useMutateProcessor<TStoreExperienceSchema | FormData, unknown>({
    url: "/experiences/store",
    key: ["experiences"],
    method: "POST",
  });

  const isSubmitting = createExperience.isPending;

  const form = useForm({
    defaultValues: {
      title: "",
      company: "",
      description: "",
      start_year: undefined,
      end_year: undefined,
      is_current: false,
      userId: useExperienceModal.uuid,
    },
    resolver: zodResolver(storeExperienceSchema),
    disabled: isSubmitting,
  });

  const isDisabled = form.formState.disabled;

  const onSubmit = (data: TStoreExperienceSchema) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    createExperience.mutate(data, {
      onSuccess: () => {
        form.reset();
        toast.success("Experience created successfully");
        useExperienceModal.onOpenChange(false);
      },
    });
  };

  return (
    <BaseModal
      open={useExperienceModal.isOpen}
      onOpenChange={useExperienceModal.onOpenChange}
      title="Add New Experience"
      description="Fill in the details below to add a new experience to your profile."
      size="md"
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
            onClear={() => form.reset()}
          />
        </form>
      </Form>
    </BaseModal>
  );
};

export default CreateExperienceModal;
