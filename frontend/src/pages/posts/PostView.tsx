/**
 * Post view page - displays a specific post with all its comments.
 */
import { useParams } from 'react-router-dom';

export default function PostView() {
  const { topicId, postId } = useParams<{ topicId: string; postId: string }>();

  return (
    <div>
      <h1>Post #{postId} in Topic #{topicId}</h1>
      <p>TODO: Implement post view with comments</p>
    </div>
  );
}
