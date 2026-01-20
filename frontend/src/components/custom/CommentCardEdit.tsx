import type { MouseEvent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Comment } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Check } from 'lucide-react';
import { updateComment } from '@/api/comments';

const updateCommentSchema = z.object({
  content: z
    .string()
    .transform(s => s.trim())
    .pipe(z.string()
      .min(1, 'Content is required')
      .max(1000, 'Content must not exceed 1000 characters')),
  has_spoilers: z.boolean().optional(),
});

type UpdateCommentFormData = z.infer<typeof updateCommentSchema>;

interface CommentCardEditProps {
  comment: Comment;
  onCancel: () => void;
  onUpdate: (updatedComment: Comment) => void;
}

export default function CommentCardEdit({ comment, onCancel, onUpdate }: CommentCardEditProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    control,
    reset,
  } = useForm<UpdateCommentFormData>({
    resolver: zodResolver(updateCommentSchema),
    defaultValues: {
      content: comment.content,
      has_spoilers: comment.has_spoilers,
    },
  });

  const content = watch('content');

  const onSubmit = async (data: UpdateCommentFormData) => {
    try {
      const updatedComment = await updateComment(comment.comment_id, {
        content: data.content,
        has_spoilers: data.has_spoilers || false,
      });

      onUpdate(updatedComment);
    } catch (err: any) {
      console.error('Failed to update comment:', err);
      alert(err.response?.data?.error || 'Failed to update comment. Please try again.');
    }
  };

  const handleCancelClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    reset();
    onCancel();
  };

  return (
    <Card variant="sport" className="border-l-4 border-l-[var(--sport-blue)]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {comment.author?.username ? (
                <span className="font-semibold">{comment.author.username}</span>
              ) : (
                <span className="font-semibold">Anonymous</span>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                type="submit"
                variant="sport-ghost"
                size="icon"
                disabled={isSubmitting}
                className="h-8 w-8"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="sport-ghost"
                size="icon"
                onClick={handleCancelClick}
                disabled={isSubmitting}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">
              Content <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              rows={6}
              maxLength={1000}
              {...register('content')}
              disabled={isSubmitting}
              variant="sport"
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
            <p className="text-xs text-[var(--sport-muted)]">
              {content?.length || 0}/1000 characters
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="has_spoilers"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="has_spoilers"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              )}
            />
            <Label
              htmlFor="has_spoilers"
              className="text-sm font-normal cursor-pointer"
            >
              This comment contains spoilers
            </Label>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
