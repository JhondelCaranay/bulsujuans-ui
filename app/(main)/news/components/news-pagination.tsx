import { Button } from "@/components/ui/button";
import React from "react";

export type NewsPaginationProps = {
  totalPages: number;
  page: number;
  onNext: () => void;
  onPrev: () => void;
};

const NewsPagination = ({ page, totalPages, onNext, onPrev }: NewsPaginationProps) => {
  return (
    <div className="flex justify-between items-center mt-4 pt-4 border-t">
      <Button variant="outline" size="sm" disabled={page === 1} onClick={onPrev}>
        Previous
      </Button>

      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>

      <Button variant="outline" size="sm" disabled={page === totalPages} onClick={onNext}>
        Next
      </Button>
    </div>
  );
};
export default NewsPagination;
