import { useState, useEffect } from 'react';
import { getTopics } from '@/api/topics';
import type { Topic, PaginationMetadata } from '@/types';
import TopicCard from '@/components/custom/TopicCard';
import CreateTopicDialog from '@/components/custom/CreateTopicDialog';
import PaginationControls from '@/components/custom/PaginationControls';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function Topics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [pagination, setPagination] = useState<PaginationMetadata | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setIsLoading(true);
        const response = await getTopics({ page, page_size: 100 });
        setTopics(response.data);
        setPagination(response.pagination);
        setError('');
      } catch (err) {
        console.error('Failed to fetch topics:', err);
        setError('Failed to load topics. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, [page]);

  const handleCreateTopic = () => {
    setShowCreateDialog(true);
  };

  // TODO: Replace with proper loading skeleton
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading topics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">No topics yet</h2>
        <p className="text-gray-500 mb-4">Be the first to create a topic!</p>
        <Button onClick={handleCreateTopic}>Create Topic</Button>
        <CreateTopicDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      </div>
    );
  }

  const handleDeleteTopic = (topicId: number) => {
    setTopics((prevTopics) => prevTopics.filter((t) => t.topic_id !== topicId));
  };

  const handleUpdateTopic = (updatedTopic: Topic) => {
    setTopics((prevTopics) =>
      prevTopics.map((t) => (t.topic_id === updatedTopic.topic_id ? updatedTopic : t))
    );
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Browse Topics</h1>
          <p className="text-gray-600 mt-1">
            Explore games and discussions
          </p>
        </div>
        <Button onClick={handleCreateTopic}>Create Topic</Button>
      </div>

      <div className="space-y-4">
        {topics.map((topic) => (
          <TopicCard
            key={topic.topic_id}
            topic={topic}
            onDelete={handleDeleteTopic}
            onUpdate={handleUpdateTopic}
          />
        ))}
      </div>

      {pagination && (
        <PaginationControls pagination={pagination} onPageChange={setPage} />
      )}

      <CreateTopicDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}
