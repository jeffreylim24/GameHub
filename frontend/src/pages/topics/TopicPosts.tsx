import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTopic } from '@/api/topics';
import { getPosts } from '@/api/posts';
import type { Topic, Post, PaginationMetadata } from '@/types';
import PostCard from '@/components/custom/PostCard';
import TopicCard from '@/components/custom/TopicCard';
import PaginationControls from '@/components/custom/PaginationControls';
import SearchBar from '@/components/custom/SearchBar';
import { useDebounce } from '@/hooks/useDebounce';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

// TODO: Infinite scroll but find way to optimize performance for large number of posts
export default function TopicPosts() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationMetadata | null>(null);
  const [page, setPage] = useState(1);
  const [isTopicLoading, setIsTopicLoading] = useState(true);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    const fetchTopic = async () => {
      if (!topicId) return;

      try {
        setIsTopicLoading(true);
        const topicData = await getTopic(Number(topicId));
        setTopic(topicData);
        setError('');
      } catch (err) {
        console.error('Failed to fetch topic:', err);
        setError('Topic not found');
      } finally {
        setIsTopicLoading(false);
      }
    };

    fetchTopic();
  }, [topicId]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!topicId) return;

      try {
        setIsPostsLoading(true);
        const postsResponse = await getPosts({
          topic_id: Number(topicId),
          page,
          search: debouncedSearch || undefined,
        });
        setPosts(postsResponse.data);
        setPagination(postsResponse.pagination);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      } finally {
        setIsPostsLoading(false);
      }
    };

    fetchPosts();
  }, [topicId, page, debouncedSearch]);

  if (isTopicLoading) {
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

  const handleDeleteTopic = () => {
    navigate('/topics');
  };

  const handleUpdateTopic = (updatedTopic: Topic) => {
    setTopic(updatedTopic);
  };

  return (
    <div className="space-y-6">
      <TopicCard
        topic={topic}
        clickable={false}
        onDelete={handleDeleteTopic}
        onUpdate={handleUpdateTopic}
      />

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Posts</h2>
          <Button onClick={() => navigate(`/posts/new?topicId=${topicId}`)}>
            Create Post
          </Button>
        </div>

        <div className="mb-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search posts in this topic..."
          />
        </div>

        {isPostsLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading posts...</p>
          </div>
        ) : posts.length === 0 && debouncedSearch ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No posts found matching "{debouncedSearch}"
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No posts in this topic yet.</p>
            <Button onClick={() => navigate(`/posts/new?topicId=${topicId}`)}>
              Create the first post
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.post_id} post={post} />
              ))}
            </div>

            {pagination && (
              <PaginationControls pagination={pagination} onPageChange={setPage} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
