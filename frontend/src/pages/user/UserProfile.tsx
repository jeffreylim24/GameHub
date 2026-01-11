import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUser } from '@/api/users';
import { getPosts } from '@/api/posts';
import { getComments } from '@/api/comments';
import type { User, Post, Comment } from '@/types';
import PostCard from '@/components/custom/PostCard';
import CommentCard from '@/components/custom/CommentCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// TODO: Implement pagination for posts and comments if needed
export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setError('User not found');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userData = await getUser(Number(userId));
        const [postsData, commentsData] = await Promise.all([
          getPosts({ author_id: userData.user_id }),
          getComments({ author_id: userData.user_id }),
        ]);

        setUser(userData);
        setPosts(postsData);
        setComments(commentsData);
        setError('');
      } catch (err) {
        console.error('Failed to load user profile:', err);
        setError('User not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handlePostDeleted = (postId: number) => {
    setPosts((prev) => prev.filter((p) => p.post_id !== postId));
    setComments((prev) => prev.filter((c) => c.post_id !== postId));
  };

  const handleCommentDeleted = (commentId: number) => {
    setComments((prev) => prev.filter((c) => c.comment_id !== commentId));
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="items-center justify-center">{error || 'User not found'}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{user.username}</h1>
        <p className="text-gray-600 mt-1">
          Joined {formatJoinDate(user.created_at)}
        </p>
      </div>

      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Posts ({posts.length})</TabsTrigger>
          <TabsTrigger value="comments">Comments ({comments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No posts yet.
            </p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.post_id} post={post} onDelete={handlePostDeleted} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="comments">
          {comments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No comments yet.
            </p>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <CommentCard key={comment.comment_id} comment={comment} onDelete={handleCommentDeleted} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
