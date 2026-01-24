import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Controlled search input with an inline clear button.
 *
 * @example
 * ```tsx
 * <SearchBar value={query} onChange={setQuery} placeholder="Search topics" />
 * ```
 */
export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  className,
}: SearchBarProps) {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--sport-blue)]" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        variant="sport"
        className="pl-9 pr-9 bg-white/80 shadow-[0_8px_20px_-18px_rgba(11,15,20,0.55)]"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-[var(--sport-muted)] transition-colors hover:text-[var(--sport-ink)]"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
