import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createPost } from '@/api/posts';
import { getTopics } from '@/api/topics';
import { useAuth } from '@/contexts/AuthContext';
import type { Topic, PostCategory, PostPlatform } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

const createPostSchema = z.object({
  topic_id: z.string().min(1, 'Please select a topic'),
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

type CreatePostFormData = z.infer<typeof createPostSchema>;

export default function NewPost() {
  const [searchParams] = useSearchParams();
  const topicIdFromQuery = searchParams.get('topicId');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const { currentUserId, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      topic_id: topicIdFromQuery || '',
      title: '',
      content: '',
      category: '',
      platform: '',
      has_spoilers: false,
    },
  });

  const content = watch('content');
  const title = watch('title');

  const fetchTopics = async () => {
    try {
      setIsLoadingTopics(true);
      const fetchedTopics = await getTopics();
      setTopics(fetchedTopics);
    } catch (err) {
      console.error('Failed to fetch topics:', err);
      setError('Failed to load topics. Please try again.');
    } finally {
      setIsLoadingTopics(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const onSubmit = async (data: CreatePostFormData) => {
    if (!isAuthenticated || !currentUserId) {
      setError('You must be logged in to create a post.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const newPost = await createPost({
        topic_id: Number(data.topic_id),
        author_id: currentUserId,
        title: data.title,
        content: data.content,
        category: (data.category || '') as PostCategory | '',
        platform: (data.platform || '') as PostPlatform | '',
        has_spoilers: data.has_spoilers || false,
      });

      navigate(`/topics/${newPost.topic_id}/posts/${newPost.post_id}`);
    } catch (err: any) {
      console.error('Failed to create post:', err);
      setError(
        err.response?.data?.error || 'Failed to create post. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (topicIdFromQuery) {
      navigate(`/topics/${topicIdFromQuery}`);
    } else {
      navigate('/topics');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>
              You must be logged in to create a post.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate('/')}>
                Back to Home
              </Button>
              <Button onClick={() => navigate('/login')}>Go to Login</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
          <CardDescription>
            Share your thoughts, questions, or reviews about a game.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="topic">
                Topic (Game) <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="topic_id"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting || isLoadingTopics}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a game topic..." />
                    </SelectTrigger>
                    {/* TODO: Add scroll for when there are too many topics */}
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem
                          key={topic.topic_id}
                          value={topic.topic_id.toString()}
                        >
                          {topic.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.topic_id && (
                <p className="text-sm text-red-500">
                  {errors.topic_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g., Just finished the main story - thoughts?"
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

            <div className="space-y-2">
              <Label htmlFor="content">
                Content <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                placeholder="Share your thoughts, questions, or experiences..."
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

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Post'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
