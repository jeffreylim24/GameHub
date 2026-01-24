import type { MouseEvent } from 'react';
import type { Comment } from '@/types';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2 } from 'lucide-react';
import { formatRelativeTime } from '@/lib/date';
import { SpoilerOverlay } from '@/components/custom/SpoilerOverlay';

interface CommentCardDetailViewProps {
  comment: Comment;
  isAuthor: boolean;
  onDeleteClick: (event: MouseEvent<HTMLButtonElement>) => void;
  onEditClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Full comment view with metadata and optional edit/delete actions.
 *
 * @example
 * ```tsx
 * <CommentCardDetailView
 *   comment={comment}
 *   isAuthor={isAuthor}
 *   onEditClick={handleEdit}
 *   onDeleteClick={handleDelete}
 * />
 * ```
 */
export default function CommentCardDetailView({
  comment,
  isAuthor,
  onDeleteClick,
  onEditClick,
}: CommentCardDetailViewProps) {

  return (
    <SpoilerOverlay hasSpoilers={comment.has_spoilers}>
      <Card variant="sport" className="border-l-4 border-l-[var(--sport-blue)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {comment.author?.username ? (
                <Link
                  to={`/user/${comment.author.user_id}`}
                  className="font-semibold text-[var(--sport-blue)] hover:text-[var(--sport-ink)]"
                >
                  {comment.author.username}
                </Link>
              ) : (
                <span className="font-semibold text-[var(--sport-ink)]">Anonymous</span>
              )}
              <span className="text-sm text-[var(--sport-muted)]">
                {formatRelativeTime(comment.created_at)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {comment.has_spoilers && (
                <Badge variant="destructive">Spoilers</Badge>
              )}
              {isAuthor && (
                <>
                  <Button
                    variant="sport-ghost"
                    size="icon"
                    onClick={onEditClick}
                    className="h-8 w-8"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="sport-ghost"
                    size="icon"
                    onClick={onDeleteClick}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-[var(--sport-ink-2)] whitespace-pre-wrap">{comment.content}</p>
        </CardContent>
      </Card>
    </SpoilerOverlay>
  );
}
