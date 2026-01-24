import { useState, useEffect } from 'react';
import { getTopics } from '@/api/topics';
import type { Topic, PaginationMetadata } from '@/types';
import TopicCard from '@/components/custom/TopicCard';
import CreateTopicDialog from '@/components/custom/CreateTopicDialog';
import PaginationControls from '@/components/custom/PaginationControls';
import SearchBar from '@/components/custom/SearchBar';
import { useDebounce } from '@/hooks/useDebounce';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

/**
 * Topics index page with search, pagination, and create topic dialog.
 *
 * @example
 * ```tsx
 * <Topics />
 * ```
 */
export default function Topics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [pagination, setPagination] = useState<PaginationMetadata | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setIsLoading(true);
        const response = await getTopics({
          page,
          page_size: 100,
          search: debouncedSearch || undefined,
        });
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
  }, [page, debouncedSearch]);

  const handleCreateTopic = () => {
    setShowCreateDialog(true);
  };

  const handleDeleteTopic = (topicId: number) => {
    setTopics((prevTopics) => prevTopics.filter((t) => t.topic_id !== topicId));
  };

  const handleUpdateTopic = (updatedTopic: Topic) => {
    setTopics((prevTopics) =>
      prevTopics.map((t) => (t.topic_id === updatedTopic.topic_id ? updatedTopic : t))
    );
  };

  const renderTopicsContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <p className="text-[var(--sport-muted)]">Loading topics...</p>
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

    if (topics.length === 0 && debouncedSearch) {
      return (
        <div className="text-center py-12">
          <p className="text-[var(--sport-muted)]">
            No topics found matching "{debouncedSearch}"
          </p>
        </div>
      );
    }

    if (topics.length === 0) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">No topics yet</h2>
          <p className="text-[var(--sport-muted)] mb-4">Be the first to create a topic!</p>
        </div>
      );
    }

    return (
      <>
        <div className="space-y-4">
          {topics.map((topic, index) => (
            <div
              key={topic.topic_id}
              className="motion-safe:animate-[sport-rise_0.45s_ease-out_both]"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <TopicCard
                topic={topic}
                onDelete={handleDeleteTopic}
                onUpdate={handleUpdateTopic}
              />
            </div>
          ))}
        </div>

        {pagination && (
          <PaginationControls pagination={pagination} onPageChange={setPage} />
        )}
      </>
    );
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--sport-muted)]">
            <span className="h-2 w-2 rounded-full bg-[var(--sport-orange)]" />
            Topic Hub
          </div>
          <h1 className="text-3xl font-bold mt-2">Browse Topics</h1>
          <p className="text-[var(--sport-muted)] mt-1">
            Explore games and discussions
          </p>
        </div>
        <Button variant="sport" onClick={handleCreateTopic}>
          Create Topic
        </Button>
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search topics by title..."
        />
      </div>

      {renderTopicsContent()}

      <CreateTopicDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}
