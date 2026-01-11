import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPost, deletePost } from '@/api/posts';
import { getComments } from '@/api/comments';
import type { Post, Comment } from '@/types';
import CommentCard from '@/components/custom/CommentCard';
import CommentForm from '@/components/custom/CommentForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
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

export default function PostView() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { currentUserId } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAuthor = post && currentUserId !== null && post.author_id === currentUserId;

  useEffect(() => {
    const fetchData = async () => {
      if (!postId) return;

      try {
        setIsLoading(true);
        const [postData, commentsData] = await Promise.all([
          getPost(Number(postId)),
          getComments({ post_id: Number(postId) }),
        ]);

        setPost(postData);
        setComments(commentsData);
        setError('');
      } catch (err) {
        console.error('Failed to fetch post data:', err);
        setError('Post not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  const handleCommentAdded = (newComment: Comment) => {
    setComments((prev) => [...prev, newComment]);
  };

  const handleCommentDeleted = (commentId: number) => {
    setComments((prev) => prev.filter((c) => c.comment_id !== commentId));
  };

  const handleDeletePost = async () => {
    if (!post) return;

    try {
      setIsDeleting(true);
      await deletePost(post.post_id);
      navigate(`/topics/${post.topic_id}`);
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post. Please try again.');
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

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

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="items-center justify-center">
          {error || 'Post not found'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDeleteDialog(true)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
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
              onClick={handleDeletePost}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          Comments ({comments.length})
        </h2>

        <CommentForm postId={Number(postId)} onCommentAdded={handleCommentAdded} />
        
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <CommentCard
                key={comment.comment_id}
                comment={comment}
                onDelete={handleCommentDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
