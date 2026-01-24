import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { createComment } from '@/api/comments';
import type { Comment } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CommentFormProps {
  postId: number;
  onCommentAdded: (comment: Comment) => void;
}

const commentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must not exceed 1000 characters'),
  has_spoilers: z.boolean(),
});

type CommentFormData = z.infer<typeof commentSchema>;

/**
 * Auth-gated form for adding a comment to a post.
 *
 * @example
 * ```tsx
 * <CommentForm postId={postId} onCommentAdded={handleAdd} />
 * ```
 */
export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const { isAuthenticated, currentUserId } = useAuth();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: '',
      has_spoilers: false,
    },
  });

  const content = watch('content');

  const onSubmit = async (data: CommentFormData) => {
    if (!isAuthenticated || !currentUserId) {
      setError('You must be logged in to comment');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const newComment = await createComment({
        post_id: postId,
        author_id: currentUserId,
        content: data.content.trim(),
        has_spoilers: data.has_spoilers,
      });

      onCommentAdded(newComment);
      reset();
    } catch (err: any) {
      console.error('Failed to create comment:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to post comment. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Alert className="border-[var(--sport-border)] bg-[var(--sport-surface-2)]">
        <AlertDescription>
          Please log in to leave a comment.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card variant="sport" className="border-l-4 border-l-[var(--sport-red)]">
      <CardHeader>
        <CardTitle>Add a Comment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Your Comment</Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts..."
              {...register('content')}
              disabled={isSubmitting}
              rows={4}
              maxLength={1000}
              variant="sport"
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
            <p className="text-xs text-[var(--sport-muted)] text-right">
              {content?.length || 0}/1000 characters
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="spoilers"
              {...register('has_spoilers')}
              disabled={isSubmitting}
            />
            <Label htmlFor="spoilers" className="cursor-pointer">
              This comment contains spoilers
            </Label>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isSubmitting} variant="sport">
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
