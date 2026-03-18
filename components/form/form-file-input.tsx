import type { Control, FieldValues, Path } from "react-hook-form";
import { useState, DragEvent } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface FormFileInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  multiple?: boolean;
  accept?: string;
}

export function FormFileInput<T extends FieldValues>({
  control,
  name,
  label,
  multiple = false,
  accept,
}: FormFileInputProps<T>) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const handleFiles = (files: FileList) => {
          if (!files) return;
          field.onChange(multiple ? Array.from(files) : files[0]);
        };

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (!e.target.files) return;
          handleFiles(e.target.files);
        };

        const handleDrop = (e: DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
          if (!e.dataTransfer.files) return;
          handleFiles(e.dataTransfer.files);
        };

        const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        };

        const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        };

        return (
          <FormItem className="flex flex-col gap-2">
            <FormLabel htmlFor={name} className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
              {label}
            </FormLabel>
            <FormControl>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg px-4 py-5 cursor-pointer transition 
                  ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-100"} 
                  hover:border-blue-300 hover:bg-blue-50`}
              >
                <input
                  id={name}
                  type="file"
                  multiple={multiple}
                  accept={accept}
                  onChange={handleChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="text-center text-gray-600">
                  <p>Drag & drop files here</p>
                  <p className="text-sm">{multiple ? "or select multiple files" : "or select a file"}</p>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
