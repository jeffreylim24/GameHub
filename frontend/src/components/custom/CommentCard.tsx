import type { Comment } from '@/types';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CommentCardProps {
  comment: Comment;
}

export default function CommentCard({ comment }: CommentCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {comment.author?.username ? (
              <Link
                to={`/user/${comment.author.username}`}
                className="font-semibold hover:underline"
              >
                {comment.author.username}
              </Link>
            ) : (
              <span className="font-semibold">Anonymous</span>
            )}
            <span className="text-sm text-gray-500">
              {formatDate(comment.created_at)}
            </span>
          </div>
          {comment.has_spoilers && (
            <Badge variant="destructive">Spoilers</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
      </CardContent>
    </Card>
  );
}
