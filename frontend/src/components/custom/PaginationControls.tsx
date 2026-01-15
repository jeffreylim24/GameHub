import type { PaginationMetadata } from '@/types';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';

interface PaginationControlsProps {
  pagination: PaginationMetadata;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  pagination,
  onPageChange,
}: PaginationControlsProps) {
  const { current_page, total_pages, has_previous, has_next } = pagination;

  if (total_pages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(current_page - 1)}
            aria-disabled={!has_previous}
            className={
              !has_previous ? 'pointer-events-none opacity-50' : 'cursor-pointer'
            }
          />
        </PaginationItem>

        <PaginationItem>
          <span className="px-4 text-sm text-muted-foreground">
            Page {current_page} of {total_pages}
          </span>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(current_page + 1)}
            aria-disabled={!has_next}
            className={!has_next ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
