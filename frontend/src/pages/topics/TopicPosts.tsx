/**
 * Topic posts page - displays all posts for a specific topic.
 */
import { useParams } from 'react-router-dom';

export default function TopicPosts() {
  const { topicId } = useParams<{ topicId: string }>();

  return (
    <div>
      <h1>Posts for Topic #{topicId}</h1>
      <p>TODO: Implement topic posts list</p>
    </div>
  );
}
