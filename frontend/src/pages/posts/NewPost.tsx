/**
 * New post page - form to create a new post in a topic.
 */
import { useParams } from 'react-router-dom';

export default function NewPost() {
  const { topicId } = useParams<{ topicId: string }>();

  return (
    <div>
      <h1>Create New Post in Topic #{topicId}</h1>
      <p>TODO: Implement new post form</p>
    </div>
  );
}
