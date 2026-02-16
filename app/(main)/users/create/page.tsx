"use client";

import React from "react";
import CreateUserForm from "./components/create-user-form";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { Option } from "@/types";
import { PageLoading } from "@/components/page-loading";

const Page = () => {
  const { data: roleOptions, isLoading: isRoleOptionsLoading } = useQueryProcessor<Option[]>({
    url: "/roles/options",
    key: ["role-options"],
  });

  const { data: officeOptions, isLoading: isOfficeOptionsLoading } = useQueryProcessor<Option[]>({
    url: "/offices/options",
    key: ["office-options"],
  });

  if (isRoleOptionsLoading || isOfficeOptionsLoading) {
    return (
      <div className="w-full h-full p-10">
        <PageLoading />
      </div>
    );
  }

  return (
    <div className="bg-[#eeeeee] w-full h-full flex justify-center items-center p-10">
      <CreateUserForm roleOptions={roleOptions || []} officeOptions={officeOptions || []} />
    </div>
  );
};

export default Page;
