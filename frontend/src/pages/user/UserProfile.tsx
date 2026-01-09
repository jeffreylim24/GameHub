/**
 * User profile page - displays user's posts and comments with tabs.
 */
import { useParams } from 'react-router-dom';

export default function UserProfile() {
  const { username } = useParams<{ username: string }>();

  return (
    <div>
      <h1>Profile: {username}</h1>
      <p>TODO: Implement profile with tabs (Posts/Comments)</p>
    </div>
  );
}
