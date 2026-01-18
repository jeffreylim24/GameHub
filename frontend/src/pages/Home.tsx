import { useState, useEffect } from 'react';
import { getPosts } from '@/api/posts';
import type { Post, PaginationMetadata } from '@/types';
import PostCard from '@/components/custom/PostCard';
import PaginationControls from '@/components/custom/PaginationControls';
import SearchBar from '@/components/custom/SearchBar';
import { useDebounce } from '@/hooks/useDebounce';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
          <p className="text-gray-500">Loading posts...</p>
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
          <p className="text-gray-500">
            No posts found matching "{debouncedSearch}"
          </p>
        </div>
      );
    }

    if (posts.length === 0) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">No posts yet</h2>
          <p className="text-gray-500">Be the first to create a post!</p>
        </div>
      );
    }

    return (
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
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">All Posts</h1>
        <p className="text-gray-600 mt-1">
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
