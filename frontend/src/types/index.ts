/**
 * @fileoverview TypeScript type definitions for GameHub API.
 *
 * Contains all shared types including:
 * - Core entities (User, Topic, Post, Comment)
 * - API request/response types
 * - Pagination types
 *
 * @module types
 */

/**
 * User entity representing a forum member.
 */
export interface User {
  user_id: number;
  username: string;
  role: string;
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
  post?: Post;
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
 * Request payload for user registration.
 */
export interface RegisterRequest {
  username: string;
  password: string;
}

/**
 * Request payload for user login.
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Authentication response containing user data and JWT token.
 */
export interface AuthResponse {
  user: User;
  token: string;
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
 * Pagination metadata returned by the API.
 * Contains information about the current page and total results.
 */
export interface PaginationMetadata {
  current_page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

/**
 * Generic paginated response wrapper.
 * All list endpoints return this format.
 * @template T - The type of items in the data array
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}

/**
 * Query parameters for pagination.
 * Used when making requests to paginated endpoints.
 */
export interface PaginationParams {
  page?: number;
  page_size?: number;
}

/**
 * Query parameters for filtering posts.
 * Extends PaginationParams to support paginated requests.
 */
export interface GetPostsParams extends PaginationParams {
  topic_id?: number;
  author_id?: number;
  category?: PostCategory;
  platform?: PostPlatform;
  search?: string;
}

/**
 * Query parameters for filtering comments.
 * Extends PaginationParams to support paginated requests.
 */
export interface GetCommentsParams extends PaginationParams {
  post_id?: number;
  author_id?: number;
}

/**
 * Query parameters for fetching topics.
 * Extends PaginationParams to support paginated requests.
 */
export interface GetTopicsParams extends PaginationParams {
  search?: string;
}

/**
 * Query parameters for fetching users.
 * Extends PaginationParams to support paginated requests.
 */
export interface GetUsersParams extends PaginationParams {}
