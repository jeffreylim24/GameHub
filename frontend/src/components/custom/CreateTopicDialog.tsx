import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createTopic } from '@/api/topics';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

const createTopicSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must not exceed 200 characters'),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
});

type CreateTopicFormData = z.infer<typeof createTopicSchema>;

interface CreateTopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateTopicDialog({
  open,
  onOpenChange,
}: CreateTopicDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { currentUserId, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateTopicFormData>({
    resolver: zodResolver(createTopicSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const description = watch('description');

  const onSubmit = async (data: CreateTopicFormData) => {
    if (!isAuthenticated || !currentUserId) {
      setError('You must be logged in to create a topic.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const newTopic = await createTopic({
        title: data.title,
        description: data.description || '',
        created_by: currentUserId,
      });

      reset();
      onOpenChange(false);
      navigate(`/topics/${newTopic.topic_id}`);
    } catch (err: any) {
      console.error('Failed to create topic:', err);
      setError(
        err.response?.data?.error || 'Failed to create topic. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setError('');
      onOpenChange(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You must be logged in to create a topic.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={() => navigate('/login')}>Go to Login</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Topic</DialogTitle>
          <DialogDescription>
            Add a new game or discussion topic to the forum.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Elden Ring, The Legend of Zelda"
                {...register('title')}
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the game or topic..."
                rows={3}
                maxLength={500}
                {...register('description')}
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
              <p className="text-xs text-gray-500">
                {description?.length || 0}/500 characters
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Topic'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
