import type { MouseEvent } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Post } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { deletePost } from '@/api/posts';

interface PostCardProps {
  post: Post;
  onDelete?: (postId: number) => void;
}

export default function PostCard({ post, onDelete }: PostCardProps) {
  const navigate = useNavigate();
  const { currentUserId } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAuthor = currentUserId !== null && post.author_id === currentUserId;

  const handleClick = () => {
    navigate(`/topics/${post.topic_id}/posts/${post.post_id}`);
  };

  const handleTopicAndProfileClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
  };

  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await deletePost(post.post_id);
      setShowDeleteDialog(false);
      if (onDelete) {
        onDelete(post.post_id);
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
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
    <>
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
                  onClick={handleTopicAndProfileClick}
                  className="font-semibold hover:underline"
                >
                  {post.topic?.title}
                </Link>
                {' • '}
                by{' '}
                {post.author?.username ? (
                  <Link
                    to={`/user/${post.author.user_id}`}
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
            <div className="flex gap-2 items-start">
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
              {isAuthor && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDeleteClick}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{post.title}"? This action cannot be undone and will also delete all comments on this post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
