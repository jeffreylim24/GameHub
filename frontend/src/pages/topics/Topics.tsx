import { useState, useEffect } from 'react';
import { getTopics } from '@/api/topics';
import type { Topic } from '@/types';
import TopicCard from '@/components/custom/TopicCard';
import CreateTopicDialog from '@/components/custom/CreateTopicDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

// TODO: Add pagination if topics exceed certain number
export default function Topics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setIsLoading(true);
        const data = await getTopics();
        setTopics(data);
        setError('');
      } catch (err) {
        console.error('Failed to fetch topics:', err);
        setError('Failed to load topics. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, []);

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

      <CreateTopicDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}
