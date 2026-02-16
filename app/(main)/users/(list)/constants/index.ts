export enum userRole {
  ADMIN = "admin",
  STUDENT = "students",
  TEACHER = "teaching staff",
  NONTEACHER = "non-teaching staff",
}

export const userRoleConfig = {
  [userRole.ADMIN]: {
    color: "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    label: "Admin",
    status_color: "bg-amber-500",
  },

  [userRole.STUDENT]: {
    color: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    label: "Student",
    status_color: "bg-blue-500",
  },

  [userRole.TEACHER]: {
    color: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800",
    badge: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    label: "Teaching Staff",
    status_color: "bg-purple-500",
  },

  [userRole.NONTEACHER]: {
    color: "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800",
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    label: "Non-Teaching Staff",
    status_color: "bg-emerald-500",
  },
  ["Unknown"]: {
    color: "bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800",
    badge: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    label: "Unknown",
    status_color: "bg-gray-500",
  },
};
