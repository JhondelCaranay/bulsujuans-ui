"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { Option, User } from "@/types";
import { PageLoading } from "@/components/page-loading";
import EditUserForm from "./components/edit-user-form";

export interface UserQuery {
  data: User;
  success: boolean;
  message: string;
}

const Page = () => {
  const user_id = useParams().id;

  const { data: userData, isLoading: isUserLoading } = useQueryProcessor<UserQuery>({
    url: `/users/show/${user_id}`,
    key: ["users", user_id],
    options: {
      enabled: !!user_id,
    },
  });

  const { data: roleOptions, isLoading: isRoleOptionsLoading } = useQueryProcessor<Option[]>({
    url: "/roles/options",
    key: ["role-options"],
  });

  const { data: officeOptions, isLoading: isOfficeOptionsLoading } = useQueryProcessor<Option[]>({
    url: "/offices/options",
    key: ["office-options"],
  });

  if (!userData?.data || isUserLoading || isRoleOptionsLoading || isOfficeOptionsLoading) {
    return (
      <div className="w-full h-full p-10">
        <PageLoading />
      </div>
    );
  }

  return (
    <div className="bg-[#eeeeee] w-full h-full flex justify-center items-center p-10">
      <EditUserForm data={userData?.data} roleOptions={roleOptions || []} officeOptions={officeOptions || []} />

      {/* <pre>
        <code>{JSON.stringify(userData?.data, null, 2)}</code>
      </pre> */}
    </div>
  );
};

export default Page;
