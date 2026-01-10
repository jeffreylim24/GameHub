import React, { useState } from 'react';
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

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const { isAuthenticated, currentUserId } = useAuth();
  const [content, setContent] = useState('');
  const [hasSpoilers, setHasSpoilers] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated || !currentUserId) {
      setError('You must be logged in to comment');
      return;
    }

    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const newComment = await createComment({
        post_id: postId,
        author_id: currentUserId,
        content: content.trim(),
        has_spoilers: hasSpoilers,
      });

      onCommentAdded(newComment);
      setContent('');
      setHasSpoilers(false);
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
      <Alert>
        <AlertDescription>
          Please log in to leave a comment.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a Comment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Your Comment</Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSubmitting}
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 text-right">
              {content.length}/1000 characters
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="spoilers"
              checked={hasSpoilers}
              onCheckedChange={(checked) => setHasSpoilers(checked === true)}
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

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
