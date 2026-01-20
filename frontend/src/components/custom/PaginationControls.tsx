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
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(current_page - 1)}
            aria-disabled={!has_previous}
            className={
              !has_previous ? 'pointer-events-none opacity-50' : 'cursor-pointer'
            }
            variant="sport-outline"
          />
        </PaginationItem>

        <PaginationItem>
          <span className="px-4 text-xs uppercase tracking-[0.2em] text-[var(--sport-muted)]">
            Page {current_page} of {total_pages}
          </span>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(current_page + 1)}
            aria-disabled={!has_next}
            className={!has_next ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            variant="sport-outline"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
