import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost } from '@/api/posts';
import { getComments } from '@/api/comments';
import type { Post, Comment } from '@/types';
import PostCard from '@/components/custom/PostCard';
import CommentCard from '@/components/custom/CommentCard';
import CommentForm from '@/components/custom/CommentForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

export default function PostView() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!postId) return;

      try {
        setIsLoading(true);
        const [postData, commentsData] = await Promise.all([
          getPost(Number(postId)),
          getComments({ post_id: Number(postId) }),
        ]);

        setPost(postData);
        setComments(commentsData);
        setError('');
      } catch (err) {
        console.error('Failed to fetch post data:', err);
        setError('Post not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  const handleCommentAdded = (newComment: Comment) => {
    setComments((prev) => [...prev, newComment]);
  };

  const handleCommentDeleted = (commentId: number) => {
    setComments((prev) => prev.filter((c) => c.comment_id !== commentId));
  };

  const handlePostDeleted = () => {
    navigate(`/topics/${post?.topic_id}`);
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPost(updatedPost);
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="items-center justify-center">
          {error || 'Post not found'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <PostCard post={post} variant="detail" onDelete={handlePostDeleted} onUpdate={handlePostUpdated} />

      <Separator />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          Comments ({comments.length})
        </h2>

        <CommentForm postId={Number(postId)} onCommentAdded={handleCommentAdded} />
        
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <CommentCard
                key={comment.comment_id}
                comment={comment}
                onDelete={handleCommentDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
