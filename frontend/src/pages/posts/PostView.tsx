import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPost } from '@/api/posts';
import { getComments } from '@/api/comments';
import type { Post, Comment } from '@/types';
import CommentCard from '@/components/custom/CommentCard';
import CommentForm from '@/components/custom/CommentForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

export default function PostView() {
  const { postId } = useParams<{ postId: string }>();
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
      <div className="text-sm text-gray-600">
        <Link to={`/topics/${post.topic_id}`} className="hover:underline">
          {post.topic?.title}
        </Link>
        {' / '}
        <span className="text-gray-900">{post.title}</span>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{post.title}</CardTitle>
              <CardDescription>
                Posted by <strong>{post.author?.username || 'Anonymous'}</strong>
                {' on '}
                {formatDate(post.created_at)}
                {' in '}
                <Link
                  to={`/topics/${post.topic_id}`}
                  className="font-semibold hover:underline"
                >
                  {post.topic?.title}
                </Link>
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 items-end">
              {post.category && (
                <Badge variant="secondary">{post.category}</Badge>
              )}
              {post.platform && (
                <Badge variant="outline">{post.platform}</Badge>
              )}
              {post.has_spoilers && (
                <Badge variant="destructive">Spoilers</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </p>
        </CardContent>
      </Card>

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
              <CommentCard key={comment.comment_id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
