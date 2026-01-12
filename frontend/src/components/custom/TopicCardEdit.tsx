import type { MouseEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Topic } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Check } from 'lucide-react';
import { updateTopic } from '@/api/topics';

const updateTopicSchema = z.object({
  title: z
    .string()
    .transform(s => s.trim())
    .pipe(z.string()
      .min(2, 'Title must be at least 2 characters')
      .max(200, 'Title must not exceed 200 characters')),
  description: z
    .string()
    .transform(s => s.trim())
    .pipe(z.string()
      .max(500, 'Description must not exceed 500 characters'))
    .optional(),
});

type UpdateTopicFormData = z.infer<typeof updateTopicSchema>;

interface TopicCardEditProps {
  topic: Topic;
  onCancel: () => void;
  onUpdate: (updatedTopic: Topic) => void;
}

export default function TopicCardEdit({ topic, onCancel, onUpdate }: TopicCardEditProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<UpdateTopicFormData>({
    resolver: zodResolver(updateTopicSchema),
    defaultValues: {
      title: topic.title,
      description: topic.description || '',
    },
  });

  const title = watch('title');
  const description = watch('description');

  const onSubmit = async (data: UpdateTopicFormData) => {
    try {
      const updatedTopic = await updateTopic(topic.topic_id, {
        title: data.title,
        description: data.description || '',
      });

      onUpdate(updatedTopic);
    } catch (err: any) {
      console.error('Failed to update topic:', err);
      alert(err.response?.data?.error || 'Failed to update topic. Please try again.');
    }
  };

  const handleCancelClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    reset();
    onCancel();
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  {...register('title')}
                  disabled={isSubmitting}
                  className="text-2xl font-semibold"
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  {title?.length || 0}/200 characters
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                disabled={isSubmitting}
                className="h-8 w-8"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
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
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              rows={4}
              maxLength={500}
              {...register('description')}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
            <p className="text-xs text-gray-500">
              {description?.length || 0}/500 characters
            </p>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
