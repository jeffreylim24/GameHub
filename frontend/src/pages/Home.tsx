import { useState, useEffect } from 'react';
import { getPosts } from '@/api/posts';
import type { Post, PaginationMetadata } from '@/types';
import PostCard from '@/components/custom/PostCard';
import PaginationControls from '@/components/custom/PaginationControls';
import SearchBar from '@/components/custom/SearchBar';
import { useDebounce } from '@/hooks/useDebounce';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Landing page showing the global post feed with search and pagination.
 *
 * @example
 * ```tsx
 * <Home />
 * ```
 */
export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<PaginationMetadata | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await getPosts({
          page,
          search: debouncedSearch || undefined,
        });
        setPosts(response.data);
        setPagination(response.pagination);
        setError('');
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [page, debouncedSearch]);

  const renderPostsContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <p className="text-[var(--sport-muted)]">Loading posts...</p>
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

    if (posts.length === 0 && debouncedSearch) {
      return (
        <div className="text-center py-12">
          <p className="text-[var(--sport-muted)]">
            No posts found matching "{debouncedSearch}"
          </p>
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">No posts yet</h2>
          <p className="text-[var(--sport-muted)]">Be the first to create a post!</p>
        </div>
      );
    }

    return (
      <>
        <div className="space-y-4">
          {posts.map((post, index) => (
            <div
              key={post.post_id}
              className="motion-safe:animate-[sport-rise_0.45s_ease-out_both]"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <PostCard post={post} />
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
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--sport-muted)]">
          <span className="h-2 w-2 rounded-full bg-[var(--sport-red)]" />
          Community Feed
        </div>
        <h1 className="text-4xl font-semibold mt-2 text-[var(--sport-ink)]">
          All Posts
        </h1>
        <p className="text-[var(--sport-muted)] mt-1">
          Latest discussions from the community
        </p>
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search posts by title..."
        />
      </div>

      {renderPostsContent()}
    </div>
  );
}
