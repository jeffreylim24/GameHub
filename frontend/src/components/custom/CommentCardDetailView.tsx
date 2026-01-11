import type { MouseEvent } from 'react';
import type { Comment } from '@/types';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface CommentCardDetailViewProps {
  comment: Comment;
  isAuthor: boolean;
  onDeleteClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default function CommentCardDetailView({
  comment,
  isAuthor,
  onDeleteClick,
}: CommentCardDetailViewProps) {
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {comment.author?.username ? (
              <Link
                to={`/user/${comment.author.user_id}`}
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
          <div className="flex items-center gap-2">
            {comment.has_spoilers && (
              <Badge variant="destructive">Spoilers</Badge>
            )}
            {isAuthor && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onDeleteClick}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
      </CardContent>
    </Card>
  );
}
