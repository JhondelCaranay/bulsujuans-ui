"use client";

import { FormInput } from "@/components/form/form-input";
import { FormSearch } from "@/components/form/form-search-input";
import { FormSubmitButton } from "@/components/form/form-submit-button";
import { Form } from "@/components/ui/form";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { updateUserSchema, TUpdateUserSchema } from "@/schema/user";
import { Option, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { NotepadText } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type EditUserFormProps = {
  data: User;
  roleOptions: Option[];
  officeOptions: Option[];
};

const EditUserForm = ({ data, officeOptions, roleOptions }: EditUserFormProps) => {
  const router = useRouter();

  const updateUser = useMutateProcessor<TUpdateUserSchema | FormData, unknown>({
    url: `/users/update/${data.id}`,
    key: ["users"],
    method: "PATCH",
  });

  const isSubmitting = updateUser.isPending;

  const form = useForm({
    defaultValues: {
      email: data.email || undefined,
      first_name: data.first_name || undefined,
      middle_name: data.middle_name || undefined,
      last_name: data.last_name || undefined,
      student_id: data.student_id || undefined,
      status: data.status ?? undefined,
      role_id: data.role_id || undefined,
      office_id: data.office_id || undefined,
    },
    resolver: zodResolver(updateUserSchema),
    mode: "all",
    disabled: isSubmitting,
  });

  const isDisabled = form.formState.disabled;

  const onSubmit = (data: TUpdateUserSchema) => {
    updateUser.mutate(data, {
      onSuccess: () => {
        form.reset();
        toast.success("User updated successfully");
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
            <FormSearch
              control={form.control}
              name="status"
              label="Status"
              options={[
                {
                  label: "Active",
                  value: true,
                },
                {
                  label: "Inactive",
                  value: false,
                },
              ]}
              placeholder="Status"
            />
          </section>

          <FormSubmitButton
            label="Submit"
            submittingLabel="Submitting"
            disabled={isDisabled}
            isSubmitting={isSubmitting}
          />
        </form>
      </Form>
    </div>
  );
};

export default EditUserForm;
