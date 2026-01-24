import type { MouseEvent } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EyeOff } from 'lucide-react';

interface SpoilerOverlayProps {
  hasSpoilers: boolean;
  children: React.ReactNode;
}

/**
 * Masks spoiler content until the user explicitly reveals it.
 *
 * @example
 * ```tsx
 * <SpoilerOverlay hasSpoilers={post.has_spoilers}>
 *   <PostBody />
 * </SpoilerOverlay>
 * ```
 */
export function SpoilerOverlay({ hasSpoilers, children }: SpoilerOverlayProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsRevealed(true);
  };

  if (!hasSpoilers || isRevealed) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="blur-md select-none pointer-events-none">
        {children}
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
        <Button
          variant="sport-outline"
          size="sm"
          onClick={handleReveal}
          className="gap-2"
        >
          <EyeOff className="h-4 w-4" />
          Show Spoiler
        </Button>
      </div>
    </div>
  );
}
