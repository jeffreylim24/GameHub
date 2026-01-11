import type { MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Post } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/date';

interface PostCardListViewProps {
  post: Post;
}

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
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl">{post.title}</CardTitle>
            <CardDescription className="mt-1">
              in{' '}
              <Link
                to={`/topics/${post.topic_id}`}
                onClick={handleLinkClick}
                className="font-semibold hover:underline"
              >
                {post.topic?.title}
              </Link>
              {' • '}
              by{' '}
              {post.author?.username ? (
                <Link
                  to={`/user/${post.author.user_id}`}
                  onClick={handleLinkClick}
                  className="font-semibold hover:underline"
                >
                  {post.author.username}
                </Link>
              ) : (
                <strong>Anonymous</strong>
              )}
              {' • '}
              {formatRelativeTime(post.created_at)}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-1 items-end">
            {post.category && (
              <Badge variant="secondary">{post.category}</Badge>
            )}
            {post.platform && (
              <Badge variant="outline">{post.platform}</Badge>
            )}
            {post.has_spoilers && (
              <Badge variant="destructive">Spoilers</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-2">
          {post.content}
        </p>
      </CardContent>
    </Card>
  );
}
