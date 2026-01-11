import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTopic } from '@/api/topics';
import { getPosts } from '@/api/posts';
import type { Topic, Post } from '@/types';
import PostCard from '@/components/custom/PostCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// TODO: Infinite scroll but find way to optimize performance for large number of posts
export default function TopicPosts() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!topicId) return;

      try {
        setIsLoading(true);
        const [topicData, postsData] = await Promise.all([
          getTopic(Number(topicId)),
          getPosts({ topic_id: Number(topicId) }),
        ]);

        setTopic(topicData);
        setPosts(postsData);
        setError('');
      } catch (err) {
        console.error('Failed to fetch topic data:', err);
        setError('Topic not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [topicId]);

  const handlePostDeleted = (postId: number) => {
    setPosts((prev) => prev.filter((p) => p.post_id !== postId));
  };

  // TODO: Replace with proper loading skeleton
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading topic...</p>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error || 'Topic not found'}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{topic.title}</CardTitle>
          {topic.description && (
            <CardDescription>{topic.description}</CardDescription>
          )}
        </CardHeader>
      </Card>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Posts</h2>
          <Button onClick={() => navigate(`/posts/new?topicId=${topicId}`)}>
            Create Post
          </Button>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No posts in this topic yet.</p>
            <Button onClick={() => navigate(`/posts/new?topicId=${topicId}`)}>
              Create the first post
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.post_id} post={post} onDelete={handlePostDeleted} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
