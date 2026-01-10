import type { MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Post } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/topics/${post.topic_id}/posts/${post.post_id}`);
  };
  const handleTopicAndProfileClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInMs / (1000 * 60));
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 720) {
      const weeks = Math.floor(diffInHours / 168);
      return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 8760) {
      const months = Math.floor(diffInHours / 720);
      return `${months} month${months !== 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffInHours / 8760);
      return `${years} year${years !== 1 ? 's' : ''} ago`;
    }
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
                className="font-semibold hover:underline"
              >
                {post.topic?.title}
              </Link>
              {' • '}
              by{' '}
              {post.author?.username ? (
                <Link
                  to={`/user/${post.author.username}`}
                  onClick={handleTopicAndProfileClick}
                  className="font-semibold hover:underline"
                >
                  {post.author.username}
                </Link>
              ) : (
                <strong>Anonymous</strong>
              )}
              {' • '}
              {formatDate(post.created_at)}
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
