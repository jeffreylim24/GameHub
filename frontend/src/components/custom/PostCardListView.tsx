import type { MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Post } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/date';
import { SpoilerOverlay } from '@/components/custom/SpoilerOverlay';

interface PostCardListViewProps {
  post: Post;
}

/**
 * Compact post card for list views with quick metadata and spoiler masking.
 *
 * @example
 * ```tsx
 * <PostCardListView post={post} />
 * ```
 */
export default function PostCardListView({
  post,
}: PostCardListViewProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/topics/${post.topic_id}/posts/${post.post_id}`);
  };

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
  };

  return (
    <SpoilerOverlay hasSpoilers={post.has_spoilers}>
      <Card
        variant="sport"
        className="group cursor-pointer overflow-hidden border-l-4 border-l-[var(--sport-red)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_34px_-24px_rgba(11,15,20,0.8)]"
        onClick={handleClick}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl font-semibold tracking-[0.04em] text-[var(--sport-ink)]">
                {post.title}
              </CardTitle>
              <CardDescription className="mt-1 text-[var(--sport-muted)]">
                in{' '}
                <Link
                  to={`/topics/${post.topic_id}`}
                  onClick={handleLinkClick}
                  className="font-semibold text-[var(--sport-blue)] hover:text-[var(--sport-ink)]"
                >
                  {post.topic?.title}
                </Link>
                {' • '}
                by{' '}
                {post.author?.username ? (
                  <Link
                    to={`/user/${post.author.user_id}`}
                    onClick={handleLinkClick}
                    className="font-semibold text-[var(--sport-blue)] hover:text-[var(--sport-ink)]"
                  >
                    {post.author.username}
                  </Link>
                ) : (
                  <strong className="text-[var(--sport-ink)]">Anonymous</strong>
                )}
                {' • '}
                {formatRelativeTime(post.created_at)}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-1 items-end">
              {post.category && (
                <Badge variant="sport">{post.category}</Badge>
              )}
              {post.platform && (
                <Badge variant="sport-outline">{post.platform}</Badge>
              )}
              {post.has_spoilers && (
                <Badge variant="destructive">Spoilers</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--sport-ink-2)] opacity-80 line-clamp-2">
            {post.content}
          </p>
        </CardContent>
      </Card>
    </SpoilerOverlay>
  );
}
