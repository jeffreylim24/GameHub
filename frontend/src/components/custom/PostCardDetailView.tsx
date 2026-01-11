import type { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2 } from 'lucide-react';

interface PostCardDetailViewProps {
  post: Post;
  isAuthor: boolean;
  onEditClick: (event: MouseEvent<HTMLButtonElement>) => void;
  onDeleteClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default function PostCardDetailView({
  post,
  isAuthor,
  onEditClick,
  onDeleteClick,
}: PostCardDetailViewProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">{post.title}</CardTitle>
            <CardDescription>
              Posted by{' '}
              {post.author?.username ? (
                <Link
                  to={`/user/${post.author.user_id}`}
                  className="font-semibold hover:underline"
                >
                  {post.author.username}
                </Link>
              ) : (
                <strong>Anonymous</strong>
              )}
              {' on '}
              {formatDate(post.created_at)}
              {' in '}
              <Link
                to={`/topics/${post.topic_id}`}
                className="font-semibold hover:underline"
              >
                {post.topic?.title}
              </Link>
            </CardDescription>
          </div>
          <div className="flex gap-2 items-start">
            <div className="flex flex-col gap-2 items-end">
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
            {isAuthor && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onEditClick}
                  className="h-8 w-8"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
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
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>
      </CardContent>
    </Card>
  );
}
