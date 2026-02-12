"use client";

import React from "react";
import { EditComplaintForm } from "./components/edit-complaint-form";
import { useParams } from "next/navigation";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { Complaint } from "@/types";
import { PageLoading } from "@/components/page-loading";

export interface ComplaintDetailQuery {
  data: Complaint;
  success: boolean;
  message: string;
}

const Page = () => {
  const complaintID = useParams().id;

  // get complaint by id
  const complaintDetailQuery = useQueryProcessor<ComplaintDetailQuery>({
    url: `/complaints/show/${complaintID}`,
    key: ["complaints", complaintID],
    options: {
      enabled: !!complaintID,
    },
  });

  if (complaintDetailQuery.isPending || !complaintDetailQuery.data) {
    return (
      <div className="w-full h-full p-10">
        <PageLoading />
      </div>
    );
  }

  const complaint = complaintDetailQuery?.data?.data;

  return (
    <div className="bg-[#eeeeee] w-full h-full flex justify-center items-center p-10">
      <EditComplaintForm data={complaint} />
    </div>
  );
};

export default Page;
