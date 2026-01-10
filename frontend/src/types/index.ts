/**
 * User entity representing a forum member.
 */
export interface User {
  user_id: number;
  username: string;
  created_at: string;
}

/**
 * Topic entity representing a game discussion category.
 */
export interface Topic {
  topic_id: number;
  title: string;
  description: string;
  created_by: number | null;
  creator?: User;
  created_at: string;
  updated_at: string;
}

/**
 * Post entity representing a discussion thread within a topic.
 */
export interface Post {
  post_id: number;
  topic_id: number;
  author_id: number | null;
  title: string;
  content: string;
  category?: PostCategory;
  platform?: PostPlatform;
  has_spoilers: boolean;
  topic?: Topic;
  author?: User;
  created_at: string;
  updated_at: string;
}

/**
 * Comment entity representing a reply to a post.
 */
export interface Comment {
  comment_id: number;
  post_id: number;
  author_id: number | null;
  content: string;
  has_spoilers: boolean;
  author?: User;
  created_at: string;
  updated_at: string;
}

/**
 * Post categorization types.
 */
export type PostCategory = 'Discussion' | 'Question' | 'Review' | 'Highlight' | 'Tips';

/**
 * Gaming platform types.
 */
export type PostPlatform = 'PC' | 'PlayStation' | 'Xbox' | 'Nintendo Switch';

/**
 * Request payload for user creation.
 */
export interface CreateUserRequest {
  username: string;
}

/**
 * Request payload for user updates.
 */
export interface UpdateUserRequest {
  username: string;
}

/**
 * Request payload for topic creation.
 */
export interface CreateTopicRequest {
  title: string;
  description?: string;
  created_by: number;
}

/**
 * Request payload for topic updates.
 */
export interface UpdateTopicRequest {
  title: string;
  description?: string;
}

/**
 * Request payload for post creation.
 */
export interface CreatePostRequest {
  topic_id: number;
  author_id: number;
  title: string;
  content: string;
  category?: PostCategory | '';
  platform?: PostPlatform | '';
  has_spoilers?: boolean;
}

/**
 * Request payload for post updates.
 */
export interface UpdatePostRequest {
  title: string;
  content: string;
  category?: PostCategory | '';
  platform?: PostPlatform | '';
  has_spoilers?: boolean;
}

/**
 * Request payload for comment creation.
 */
export interface CreateCommentRequest {
  post_id: number;
  author_id: number;
  content: string;
  has_spoilers?: boolean;
}

/**
 * Request payload for comment updates.
 */
export interface UpdateCommentRequest {
  content: string;
  has_spoilers?: boolean;
}

/**
 * Standard API error response.
 */
export interface ApiError {
  error: string;
}

/**
 * Query parameters for filtering posts.
 */
export interface GetPostsParams {
  topic_id?: number;
  author_id?: number;
  category?: PostCategory;
  platform?: PostPlatform;
}

/**
 * Query parameters for filtering comments.
 */
export interface GetCommentsParams {
  post_id?: number;
  author_id?: number;
}
