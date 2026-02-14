"use client";

import { PageLoading } from "@/components/page-loading";
import { useAuth } from "@/hooks/useAuth";
import { Pagination, User } from "@/types";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { useQueryProcessor } from "@/hooks/useTanstackQuery";
import { UserActions } from "./components/user-actions";
import { DataTable } from "@/components/data-table";
import { columns } from "./components/columns";

export interface UserQuery {
  data: User[];
  success: boolean;
  message: string;
  pagination: Pagination;
}

const UsersClient = () => {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  const { data } = useQueryProcessor<UserQuery>({
    url: "/users/list",
    queryParams: {
      page,
      search,
    },
    key: ["users", page, search],
  });

  return (
    <div className="w-full h-full p-10">
      <div className="flex flex-col gap-4">
        <div className="page-title">
          <h1 className="text-2xl font-semibold">Users</h1>
        </div>
        <UserActions search={search} />
      </div>

      <div className="mt-14">
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          pageCount={data?.pagination.totalPages ?? 1}
          currentPage={page}
        />
      </div>
    </div>
  );
};

const Page = () => (
  <Suspense fallback={<PageLoading />}>
    <UsersClient />
  </Suspense>
);

export default Page;
