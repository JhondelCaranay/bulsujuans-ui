import { z } from "zod";

export enum NewsCategory {
  EDUCATION = "EDUCATION",
  ANNOUNCEMENT = "ANNOUNCEMENT",
  JOBS = "JOBS",
  CAMPUS_NOTICE = "CAMPUS_NOTICE",
  HEALTH_AND_WELLNESS = "HEALTH_AND_WELLNESS",
  ADMISSIONS = "ADMISSIONS",
}

export const storeNewsSchema = z.object({
  title: z
    .string("Title is required")
    .min(1, "Title must be at least 1 character")
    .max(500, "Title must be at most 500 characters"),
  source: z
    .string("Source is required")
    .min(1, "Source must be at least 1 character")
    .max(500, "Source must be at most 500 characters"),
  content: z.string("Content is required"),
  category: z.enum(NewsCategory, `Post categopry is required`),
  posted_by_id: z.string("Posted by ID is required"),
  documents: z
    .any()
    .optional()
    .refine((files) => !files || files.length > 0, "At least one document is required"),
});
export type TStoreNewsSchema = z.infer<typeof storeNewsSchema>;

export const updateNewsSchema = storeNewsSchema.partial();
export type TUpdateNewsSchema = z.infer<typeof updateNewsSchema>;
