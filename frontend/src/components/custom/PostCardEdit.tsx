import type { MouseEvent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Post, PostCategory, PostPlatform } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Check } from 'lucide-react';
import { updatePost } from '@/api/posts';

const CATEGORIES: PostCategory[] = [
  'Discussion',
  'Question',
  'Review',
  'Highlight',
  'Tips',
];

const PLATFORMS: PostPlatform[] = [
  'PC',
  'PlayStation',
  'Xbox',
  'Nintendo Switch',
];

const updatePostSchema = z.object({
  title: z
    .string()
    .transform(s => s.trim())
    .pipe(z.string()
      .min(5, 'Title must be at least 5 characters')
      .max(300, 'Title must not exceed 300 characters')),
  content: z
    .string()
    .transform(s => s.trim())
    .pipe(z.string()
      .min(10, 'Content must be at least 10 characters')
      .max(5000, 'Content must not exceed 5000 characters')),
  category: z.string().optional(),
  platform: z.string().optional(),
  has_spoilers: z.boolean().optional(),
});

type UpdatePostFormData = z.infer<typeof updatePostSchema>;

interface PostCardEditProps {
  post: Post;
  onCancel: () => void;
  onUpdate: (updatedPost: Post) => void;
}

export default function PostCardEdit({ post, onCancel, onUpdate }: PostCardEditProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    control,
    reset,
  } = useForm<UpdatePostFormData>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
      category: post.category || '',
      platform: post.platform || '',
      has_spoilers: post.has_spoilers,
    },
  });

  const content = watch('content');
  const title = watch('title');

  const onSubmit = async (data: UpdatePostFormData) => {
    try {
      const updatedPost = await updatePost(post.post_id, {
        title: data.title,
        content: data.content,
        category: (data.category || '') as PostCategory | '',
        platform: (data.platform || '') as PostPlatform | '',
        has_spoilers: data.has_spoilers || false,
      });

      onUpdate(updatedPost);
    } catch (err: any) {
      console.error('Failed to update post:', err);
      alert(err.response?.data?.error || 'Failed to update post. Please try again.');
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
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  {title?.length || 0}/300 characters
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
            <Label htmlFor="content">
              Content <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              rows={12}
              maxLength={5000}
              {...register('content')}
              disabled={isSubmitting}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
            <p className="text-xs text-gray-500">
              {content?.length || 0}/5000 characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category (optional)</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value === 'none' ? '' : value)}
                    value={field.value || 'none'}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform (optional)</Label>
              <Controller
                name="platform"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value === 'none' ? '' : value)}
                    value={field.value || 'none'}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a platform..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {PLATFORMS.map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
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
              This post contains spoilers
            </Label>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
