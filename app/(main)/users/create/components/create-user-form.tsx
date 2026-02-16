"use client";

import React from "react";
import { FormInput } from "@/components/form/form-input";
import { FormSubmitButton } from "@/components/form/form-submit-button";
import { FormTextarea } from "@/components/form/form-textarea";
import { Form } from "@/components/ui/form";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { storeUserSchema, TStoreUserSchema } from "@/schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { NotepadText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Option } from "@/types";
import { FormSearch } from "@/components/form/form-search-input";

type CreateUserFormProps = {
  roleOptions: Option[];
  officeOptions: Option[];
};

const CreateUserForm = ({ roleOptions, officeOptions }: CreateUserFormProps) => {
  const router = useRouter();

  const createUser = useMutateProcessor<TStoreUserSchema | FormData, unknown>({
    url: "/users/store",
    key: ["users"],
    method: "POST",
  });

  const isSubmitting = createUser.isPending;

  const form = useForm({
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      student_id: "",
      role_id: undefined,
      office_id: undefined,
    },
    resolver: zodResolver(storeUserSchema),
    mode: "all",
    disabled: isSubmitting,
  });

  const isDisabled = form.formState.disabled;

  const onSubmit = (data: TStoreUserSchema) => {
    createUser.mutate(data, {
      onSuccess: () => {
        form.reset();
        toast.success("User created successfully");
        router.push("/users");
      },
    });
  };

  return (
    <div className="bg-white w-full rounded-2xl shadow-2xl p-5 overflow-y-auto">
      <div className="flex">
        <NotepadText className="text-md font-light" /> <h1 className="text-md font-light"> User Form</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off" className="flex flex-col">
          <section className="my-10 space-y-5 p-2">
            <h2 className="font-bold">User Information</h2>

            <FormInput control={form.control} name="first_name" label="First Name" placeholder="Enter first name" />
            <FormInput
              control={form.control}
              name="middle_name"
              label="Middle Name"
              placeholder="Enter middle initial"
            />
            <FormInput control={form.control} name="last_name" label="Last Name" placeholder="Enter last name" />
            <FormInput control={form.control} name="email" label="Email Address *" placeholder="Enter email address" />
            <FormInput control={form.control} name="student_id" label="Student ID" placeholder="Enter student ID" />
            <FormSearch
              control={form.control}
              name="role_id"
              label="Role"
              options={roleOptions}
              placeholder="Assign a Role"
            />
            <FormSearch
              control={form.control}
              name="office_id"
              label="Office"
              options={officeOptions}
              placeholder="Assign to office"
            />
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
    </div>
  );
};

export default CreateUserForm;
