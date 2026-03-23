"use client";
import { Form } from "@/components/ui/form";
import { NotepadText } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/form/form-input";
import { FormSearch } from "@/components/form/form-search-input";
import { FormTextarea } from "@/components/form/form-textarea";
import { FormCheckbox } from "@/components/form/form-checkbox";
import { FormDate } from "@/components/form/form-data";
import { FormSubmitButton } from "@/components/form/form-submit-button";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { complaintsOptions, TUpdateComplaintSchema } from "@/schema/complaints";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CreateFormData } from "@/lib/utils";
import { Complaint } from "@/types";

type EditComplaintFormProps = {
  data: Complaint;
};

export const EditComplaintForm = ({ data }: EditComplaintFormProps) => {
  const router = useRouter();
  const { user } = useAuth();

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const editComplaint = useMutateProcessor<TUpdateComplaintSchema | FormData, unknown>({
    url: `/complaints/update/${data.id}`,
    key: ["complaints"],
    method: "PATCH",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const isSubmitting = editComplaint.status === "pending"; // || mutation.isPending || complaintOptionsQuery.isLoading

  const form = useForm({
    defaultValues: {
      victimName: data.name || undefined,
      contactNo: data.contact_number || undefined,
      alternateMobileNo: data.alternate_contact_number || undefined,
      email: data.email || undefined,
      typeOfComplaint: data.complaint_type || undefined,
      incidentDetails: data.incident_detail || undefined,
      dateAndTime: new Date(data.date_of_incident).toISOString().slice(0, 16) || undefined,
      is_anonymous: data.is_anonymous || undefined,
    },
    mode: "all",
    disabled: isSubmitting,
  });

  const onSubmit = (value: any) => {
    const payload: TUpdateComplaintSchema & { documents: File[] } = {
      name: value.victimName,
      email: value.email,
      contact_number: value.contactNo.toString(),
      alternate_contact_number: value.alternateMobileNo.toString(),
      incident_detail: value.incidentDetails,
      complaint_type: value.typeOfComplaint,
      date_of_incident: value.dateAndTime,
      complainant_id: user?.id as string,
      is_anonymous: value.is_anonymous,
      documents: files,
    };

    const formData = CreateFormData<TUpdateComplaintSchema>(payload);

    editComplaint.mutate(formData, {
      onSuccess() {
        toast.success("Complaint updated");
        router.push(`/complaints/${data.id}`);
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setPreviews(selected.map((file) => URL.createObjectURL(file)));
  };

  const isDisabled = form.formState.disabled;

  return (
    <div className="bg-white w-full rounded-2xl shadow-2xl p-5 overflow-y-auto">
      <div className="flex">
        <NotepadText className="text-md font-light" /> <h1 className="text-md font-light"> Complain Form</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off" className="flex flex-col">
          <section className="victim-information my-10 space-y-5 p-2">
            <h2 className="font-bold">Victim Information</h2>

            <FormInput control={form.control} name="victimName" label="Victim Name" placeholder="enter victim name" />

            <FormInput
              type="number"
              control={form.control}
              name="contactNo"
              label="Contact Number"
              placeholder="enter contact number"
            />

            <FormInput
              type="number"
              control={form.control}
              name="alternateMobileNo"
              label="Alternate Mobile Number"
              placeholder="enter alternate mobile number"
            />

            <FormInput type="email" control={form.control} name="email" label="Email" placeholder="your email" />
          </section>

          <section className="complaint-details my-10 space-y-5 p-2">
            <h2 className="font-bold">Complaint Details</h2>

            <FormSearch
              control={form.control}
              name="typeOfComplaint"
              label="Type of Complaint"
              options={complaintsOptions}
            />

            <FormTextarea
              control={form.control}
              name="incidentDetails"
              label="Incident Description / Details"
              placeholder="Enter details of incident"
              rows={5}
            />

            <FormDate
              type="datetime-local"
              control={form.control}
              name="dateAndTime"
              label="Date and Time of Incident"
              placeholder=""
            />

            <label
              htmlFor="file"
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 transition"
            >
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 15a4 4 0 014-4h10a4 4 0 014 4v6H3v-6zm3-4V5a4 4 0 014-4h4a4 4 0 014 4v6"
                />
              </svg>
              <span className="text-gray-500 mt-2 text-sm">Click or drag files to upload</span>
              <input id="file" type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>

            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {previews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`preview-${i}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            )}
            <FormCheckbox
              control={form.control}
              name="is_anonymous"
              label="I wish to remain anonymous."
              description="Selecting this option will hide your identity from the complaint review process."
            />
          </section>

          <FormSubmitButton
            label="Update Complaint"
            submittingLabel="Updating"
            disabled={isDisabled}
            isSubmitting={isSubmitting}
          />
        </form>
      </Form>
    </div>
  );
};
