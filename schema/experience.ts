import { z } from "zod";

const currentYear = new Date().getFullYear();

export const storeExperienceSchema = z
  .object({
    title: z.string().min(1, "Title is required.").max(100, "Title must be at most 100 characters."),
    company: z.string().min(1, "Company is required.").max(100, "Company must be at most 100 characters."),
    description: z.string().max(1000, "Description must be at most 1000 characters.").optional(),

    start_year: z.coerce
      .number("Start year is required and must be a valid number.")
      .int("Start year must be a whole number.")
      .min(1900, "Start year must be a valid year.")
      .max(currentYear, "Start year cannot be in the future."),

    end_year: z.coerce
      .number("End year is required and must be a valid number.")
      .int("End year must be a whole number.")
      .min(1900, "End year must be a valid year.")
      .max(currentYear, "End year cannot be in the future.")
      .nullable()
      .optional(),

    is_current: z.boolean().optional(),

    userId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.end_year && data.end_year < data.start_year) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["end_year"],
        message: "End year cannot be earlier than start year.",
      });
    }

    if (!data.is_current && !data.end_year) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["end_year"],
        message: "End year is required unless this is your current job.",
      });
    }
  });

export type TStoreExperienceSchema = z.infer<typeof storeExperienceSchema>;
export const updateExperienceSchema = storeExperienceSchema.partial();
export type TUpdateExperienceSchema = z.infer<typeof updateExperienceSchema>;
