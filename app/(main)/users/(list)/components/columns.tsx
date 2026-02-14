"use client";

import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { cn, formatDate } from "@/lib/utils";
import { userRoleConfig } from "../constants";
import { Badge } from "@/components/ui/badge";
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: () => {
      return <div className="sr-only dark:text-white">Id</div>;
    },
    cell: ({ row }) => {
      const id = row.getValue("id") as string;

      return <div className="sr-only dark:text-white">{id}</div>;
    },
  },
  {
    accessorKey: "email",
    accessorFn: (row) => {
      return row.email || {};
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19]  flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const email = row.original.email;
      return <div className={`flex items-center`}>{email}</div>;
    },
  },
  {
    accessorKey: "first_name",
    accessorFn: (row) => {
      return row.first_name || {};
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19]  flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        First Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const firstName = row.original.first_name;
      return <div className={`flex items-center`}>{firstName}</div>;
    },
  },
  {
    accessorKey: "last_name",
    accessorFn: (row) => {
      return row.last_name || {};
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19]  flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Last Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const lastName = row.original.last_name;
      return <div className={`flex items-center`}>{lastName}</div>;
    },
  },
  {
    accessorKey: "role",
    accessorFn: (row) => {
      return row.role?.name || {};
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19]  flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Role <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const role = row.original.role?.name as keyof typeof userRoleConfig;
      const config = userRoleConfig[role] || userRoleConfig["Unknown"];

      return (
        <div>
          <Badge className={cn("dark:text-white bg-slate-500", config.color, config.badge)}>{config.label}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "deleted_at",
    header: ({ column }) => (
      <div
        className="text-[#181a19] flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const deletedAt = row.original.deleted_at;

      const isActive = !deletedAt;

      return (
        <Badge
          className={cn(
            "dark:text-white",
            isActive
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
          )}
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    accessorFn: (row) => {
      const createdAt = row.createdAt;
      return createdAt;
    },
    header: ({ column }) => {
      return (
        <div
          className=" text-[#181a19]  flex items-center cursor-pointer dark:text-white flex-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const createdAt = row.original?.createdAt;
      return <div className="">{formatDate(createdAt)}</div>;
    },
  },
  {
    id: "actions",
    size: 50,
    minSize: 50,
    cell: ({ row }) => {
      const data = row.original;
      const auth = useAuth();

      const canViewUserDetail = auth.hasPermission("users:view_detail");
      const canDeleteUser = auth.hasPermission("users:delete");
      const canEditUser = auth.hasPermission("users:edit");

      return (
        <div className="flex justify-center items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="bg-blue-500/30 text-slate-900 cursor-pointer">
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href={`/users/${data.id}`}>
                <DropdownMenuItem className="flex items-center gap-2" disabled={!canViewUserDetail}>
                  <Eye className="h-4 w-4 text-blue-500" />
                  View details
                </DropdownMenuItem>
              </Link>
              <Link href={`/users/edit/${data.id}`}>
                <DropdownMenuItem className="flex items-center gap-2" disabled={!canEditUser}>
                  <Pencil className="h-4 w-4 text-blue-500" />
                  Edit
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 text-red-600" disabled={!canDeleteUser}>
                <Trash2 className="h-4 w-4 text-red-600" />
                <span>Remove</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
