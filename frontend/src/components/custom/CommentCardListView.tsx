import type { MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Comment } from '@/types';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatAbsoluteDate } from '@/lib/date';
import { SpoilerOverlay } from '@/components/custom/SpoilerOverlay';

interface CommentCardListViewProps {
  comment: Comment;
}

export default function CommentCardListView({
  comment,
}: CommentCardListViewProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (comment.post?.topic_id && comment.post_id) {
      navigate(`/topics/${comment.post.topic_id}/posts/${comment.post_id}`);
    }
  };

  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
  };

  const truncateTitle = (title: string, maxLength: number) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  return (
    <SpoilerOverlay hasSpoilers={comment.has_spoilers}>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={handleClick}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardDescription className="text-sm">
              {comment.author?.username ? (
                <Link
                  to={`/user/${comment.author.user_id}`}
                  onClick={handleLinkClick}
                  className="font-semibold hover:underline"
                >
                  {comment.author.username}
                </Link>
              ) : (
                <strong>Anonymous</strong>
              )}
              {' commented on '}
              <strong>{truncateTitle(comment.post?.title || 'Unknown Post', 15)}</strong>
              {' in '}
              <Link
                to={`/topics/${comment.post?.topic_id}`}
                onClick={handleLinkClick}
                className="font-semibold hover:underline"
              >
                {comment.post?.topic?.title || 'Unknown Topic'}
              </Link>
              {' • '}
              {formatAbsoluteDate(comment.created_at)}
            </CardDescription>
            {comment.has_spoilers && (
              <Badge variant="destructive">Spoilers</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 line-clamp-1">
            {comment.content}
          </p>
        </CardContent>
      </Card>
    </SpoilerOverlay>
  );
}
