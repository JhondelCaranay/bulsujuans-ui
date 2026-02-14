"use client";

import React from "react";
import Link from "next/link";
import UserDetailView from "./components/user-detail-vew";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { Access, Pagination, User } from "@/types";
import { useParams } from "next/navigation";
import { PageLoading } from "@/components/page-loading";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface UserQuery {
  data: User;
  success: boolean;
  message: string;
}

export interface AccessQuery {
  data: Access[];
  success: boolean;
  message: string;
  pagination: Pagination;
}

const Page = () => {
  const user_id = useParams().id;

  const userQuery = useQueryProcessor<UserQuery>({
    url: `/users/show/${user_id}`,
    key: ["users", user_id],
    options: {
      enabled: !!user_id,
    },
  });

  const user = userQuery?.data?.data;

  if (userQuery.isPending || !user) {
    return (
      <div className="w-full h-full p-10">
        <PageLoading />
      </div>
    );
  }

  return (
    <div className="w-full h-full p-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link href="/users">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Button>
          </Link>
        </div>

        <UserDetailView user={user} />
      </div>
    </div>
  );
};

export default Page;
