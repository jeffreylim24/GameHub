import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser, deleteUser } from '@/api/users';
import { getPosts } from '@/api/posts';
import { getComments } from '@/api/comments';
import type { User, Post, Comment } from '@/types';
import PostCard from '@/components/custom/PostCard';
import CommentCard from '@/components/custom/CommentCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// TODO: Implement pagination for posts and comments if needed
export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { currentUserId, logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      setIsDeleting(true);
      await deleteUser(user.user_id);
      toast.success('Account deleted successfully');
      logout();
      navigate('/');
    } catch (err) {
      console.error('Failed to delete account:', err);
      toast.error('Failed to delete account. Please try again.');
      setIsDeleting(false);
    }
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

  const isOwnProfile = currentUserId === user.user_id;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{user.username}</h1>
          <p className="text-gray-600 mt-1">
            Joined {formatJoinDate(user.created_at)}
          </p>
        </div>
        {isOwnProfile && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account. Your posts and comments will remain but will be marked as
                  posted by a deleted user.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
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
